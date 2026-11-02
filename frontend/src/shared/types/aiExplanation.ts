export interface AIExplanation {
  strategy: "hybrid_ncf" | "cold_start" | "cosine_cross_sell";
  ncf_score?: number;
  context_boost?: number;
  cosine_score?: number;
  rating_score?: number;
  final_score: number;
  match_percent: number;
  reason: string;
}
