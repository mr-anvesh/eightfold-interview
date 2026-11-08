import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { extractTextFromBuffer } from "@/lib/extract-text";
import { analyzeResumeWithGroq } from "@/lib/resume-analyzer";

export const maxDuration = 60; // 60s max for upload & Groq inference

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const pastedText = (formData.get("text") as string | null) || "";

    if (!file && !pastedText.trim()) {
      return NextResponse.json(
        { error: "Please upload a resume file or paste your resume text." },
        { status: 400 },
      );
    }

    let extractedText = pastedText.trim();
    let fileUrl: string | null = null;
    let storagePath: string | null = null;
    let fileName: string = file?.name || "Pasted Resume";

    const admin = createSupabaseAdminClient();

    // If file provided, store in Supabase Storage and extract text
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      fileName = file.name;

      if (!extractedText) {
        extractedText = extractTextFromBuffer(buffer, file.name);
      }

      try {
        // Ensure resumes bucket exists
        const { data: buckets } = await admin.storage.listBuckets();
        const hasResumesBucket = buckets?.some((b) => b.name === "resumes");

        if (!hasResumesBucket) {
          await admin.storage.createBucket("resumes", {
            public: true,
            fileSizeLimit: 10485760, // 10MB
          });
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        storagePath = `${user.id}/${Date.now()}-${safeName}`;

        const { error: uploadError } = await admin.storage
          .from("resumes")
          .upload(storagePath, buffer, {
            contentType: file.type || "application/octet-stream",
            upsert: true,
          });

        if (!uploadError) {
          const { data: urlData } = admin.storage.from("resumes").getPublicUrl(storagePath);
          fileUrl = urlData?.publicUrl || null;
        }
      } catch (storageErr) {
        console.warn("Supabase storage upload non-fatal warning:", storageErr);
      }
    }

    if (!extractedText || extractedText.trim().length < 30) {
      return NextResponse.json(
        {
          error:
            "Could not extract sufficient text from the uploaded file. Please ensure it is not an image-only scan, or paste the text directly.",
        },
        { status: 400 },
      );
    }

    // Analyze using Groq (llama3-70b-8192)
    const analysis = await analyzeResumeWithGroq(extractedText);

    const fullResult = {
      ...analysis,
      fileUrl,
      fileName,
      analyzedAt: new Date().toISOString(),
    };

    // Persist in database
    try {
      const { error: insertErr } = await supabase.from("resumes").insert({
        user_id: user.id,
        file_name: fileName,
        file_url: fileUrl,
        file_path: storagePath,
        score: fullResult.score,
        summary: fullResult.overallSummary,
        strengths: fullResult.strengths,
        improvements: fullResult.improvements,
        section_scores: fullResult.sectionScores,
        raw_analysis: fullResult,
      });

      if (insertErr) {
        await admin.from("resumes").insert({
          user_id: user.id,
          file_name: fileName,
          file_url: fileUrl,
          file_path: storagePath,
          score: fullResult.score,
          summary: fullResult.overallSummary,
          strengths: fullResult.strengths,
          improvements: fullResult.improvements,
          section_scores: fullResult.sectionScores,
          raw_analysis: fullResult,
        });
      }
    } catch {
      // Table might not be migrated yet in remote DB; client localStorage maintains persistence
    }

    return NextResponse.json({
      success: true,
      analysis: fullResult,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to analyze resume";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let latestResume = null;
    const { data: userResume } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (userResume) {
      latestResume = userResume;
    } else {
      const admin = createSupabaseAdminClient();
      const { data: adminResume } = await admin
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (adminResume) latestResume = adminResume;
    }

    if (!latestResume) {
      return NextResponse.json({ analysis: null });
    }

    return NextResponse.json({
      analysis: latestResume.raw_analysis || {
        score: latestResume.score,
        overallSummary: latestResume.summary,
        strengths: latestResume.strengths,
        improvements: latestResume.improvements,
        sectionScores: latestResume.section_scores,
        fileName: latestResume.file_name,
        fileUrl: latestResume.file_url,
        analyzedAt: latestResume.created_at,
      },
    });
  } catch {
    return NextResponse.json({ analysis: null });
  }
}
