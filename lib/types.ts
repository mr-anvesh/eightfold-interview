export type Score = "strong" | "adequate" | "weak";

export type QAPair = {
  question: string;
  answer: string;
  score: Score;
};

export type InterviewSummaryRecord = {
  qa_pairs: QAPair[];
  overall_summary: string;
  strengths: string[] | null;
  improvements: string[] | null;
};

export type JobRecord = {
  id: string;
  title: string;
  company_name: string;
  category: string;
  difficulty: "Junior" | "Mid" | "Senior";
  description: string | null;
  job_description: string;
  interview_focus: string;
  skills?: string[] | string;
};

export type InterviewRecord = {
  id: string;
  role: string;
  company_name: string | null;
  duration_seconds: number | null;
  status: string | null;
  raw_transcript?: string | null;
  created_at: string;
  job_id: string | null;
  jobs: Pick<JobRecord, "id" | "title" | "company_name"> | null;
  interview_summaries: InterviewSummaryRecord[] | null;
};

export type ResumeSectionScore = {
  name: string;
  score: number;
  feedback: string;
};

export type ResumeAnalysisResult = {
  score: number;
  overallSummary: string;
  strengths: string[];
  improvements: string[];
  sectionScores: ResumeSectionScore[];
  targetRoles: string[];
  fileUrl?: string | null;
  fileName?: string | null;
  analyzedAt?: string;
};

export type ResumeRecord = {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string | null;
  file_path: string | null;
  score: number;
  summary: string | null;
  strengths: string[] | null;
  improvements: string[] | null;
  section_scores: ResumeSectionScore[] | null;
  raw_analysis: ResumeAnalysisResult | null;
  created_at: string;
};
