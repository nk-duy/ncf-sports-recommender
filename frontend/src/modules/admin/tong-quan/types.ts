export type DateRangeKey = 'today' | '7days' | 'thisMonth' | 'allTime';

export type ChartViewMode = 'revenue' | 'orders';

export interface DashboardProduct {
  _id?: string;
  id?: string;
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string[] | string;
  stock?: number;
}

export interface DashboardOrderItem {
  product_id?: string;
  product_name?: string;
  price?: number;
  quantity?: number;
}

export interface DashboardShippingAddress {
  full_name?: string;
  phone?: string;
  address?: string;
}

export interface DashboardOrder {
  _id?: string;
  id?: string;
  order_id?: string;
  customer_name?: string;
  shipping_address?: DashboardShippingAddress;
  total_amount?: number;
  status?: string;
  payment_method?: string;
  created_at?: string;
  items?: DashboardOrderItem[];
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  totalUsers: number;
  aov: number;
}

export interface RevenueMonthPoint {
  year: number;
  month: number;
  name: string;
  revenue: number;
  orders: number;
}

export interface CategorySharePoint {
  name: string;
  value: number;
}

export interface TopSellingProductItem {
  quantity: number;
  revenue: number;
  product: DashboardProduct;
}

export interface OrderStatusPipeline {
  pending: number;
  processing: number;
  shipping: number;
  completed: number;
  cancelled: number;
  total: number;
}

export interface PaymentMethodPoint {
  name: string;
  value: number;
}

export interface AiModelInfo {
  model_name?: string;
  num_users?: number;
  num_items?: number;
  last_trained?: string;
  metrics?: {
    negative_sampling_ratio?: string;
    hit_rate_at_10?: string | number;
    ndcg_at_10?: string | number;
  };
}

export interface AiOnlineMetrics {
  ctr: number;
  conversion_rate: number;
  ai_revenue_share: number;
  ai_revenue: number;
  hit_rate_at_10: string;
  ndcg_at_10: string;
  total_interactions: number;
}

export interface AiTrainingStatus {
  is_training: boolean;
  progress?: number;
  current_epoch?: number;
  total_epochs?: number;
  current_loss?: number;
  message?: string;
  error?: string | null;
  metrics?: {
    hit_rate_at_10?: string | number;
    ndcg_at_10?: string | number;
  };
}

export interface DatasetSummary {
  num_users: number;
  num_items: number;
  total_interactions: number;
  train_samples: number;
  test_instances: number;
  sparsity_percent: number;
}

export interface ModelHyperparameters {
  embedding_dim_gmf: number;
  embedding_dim_mlp: number;
  total_embedding_dim: number;
  mlp_layers: number[];
  negative_sampling_ratio: string;
  test_negatives: number;
  optimizer: string;
  loss_function: string;
  epochs: number;
  batch_size: number;
  inference_latency_ms: number;
}

export interface ModelEvaluationSummary {
  final_bce_loss: number;
  hr_at_8: number;
  ndcg_at_8: number;
  hr_at_10: number;
  ndcg_at_10: number;
  inference_latency_ms: number;
}

export interface EpochMetricPoint {
  epoch: number;
  bce_loss: number;
  hr_at_8: number;
  ndcg_at_8: number;
  hr_at_10?: number;
  ndcg_at_10?: number;
}

export interface BenchmarkComparisonRow {
  method: string;
  name?: string;
  description: string;
  hr_at_8: number;
  ndcg_at_8: number;
  bce_loss: number;
  is_best?: boolean;
}

export interface EvaluationMetricsData {
  trained_at?: string;
  total_training_time_sec?: number;
  dataset_summary?: DatasetSummary;
  hyperparameters?: ModelHyperparameters;
  evaluation_metrics?: ModelEvaluationSummary;
  epoch_history?: EpochMetricPoint[];
  benchmark_comparison?: BenchmarkComparisonRow[];
}

