export type Score = "strong" | "adequate" | "weak";

export type QAPair = {
  question: string;
  answer: string;
  score: Score;
};

export type InterviewSummaryRecord = {
  qa_pairs: QAPair[];
  overall_summary: string;
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
};

export type InterviewRecord = {
  id: string;
  role: string;
  company_name: string | null;
  duration_seconds: number | null;
  status: string | null;
  created_at: string;
  job_id: string | null;
  jobs: Pick<JobRecord, "id" | "title" | "company_name"> | null;
  interview_summaries: InterviewSummaryRecord[] | null;
};
