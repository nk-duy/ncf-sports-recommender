export interface AIExplanation {
  strategy: "hybrid_ncf" | "cold_start" | "cosine_cross_sell" | "visual_ncf_fusion" | string;
  ncf_score?: number;
  visual_score?: number;
  context_boost?: number;
  cosine_score?: number;
  rating_score?: number;
  final_score: number;
  match_percent: number;
  is_cross_sport_discovery?: boolean;
  reason: string;
}
