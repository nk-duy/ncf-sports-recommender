'use client';

import { useCallback, useState } from 'react';
import DashboardHeader from './DashboardHeader';
import AiRecommenderBanner from './AiRecommenderBanner';
import AiEvaluationModal from './AiEvaluationModal';
import MetricCards from './MetricCards';
import OrderPipeline from './OrderPipeline';
import DashboardCharts from './DashboardCharts';
import TopProductsAndInventory from './TopProductsAndInventory';
import RecentOrdersTable from './RecentOrdersTable';
import { useDashboardData } from '../hooks/useDashboardData';
import { exportOverviewExcel } from '../utils/exportOverviewExcel';
import {
  formatDashboardOrderDate,
  formatDashboardPrice,
  renderOrderStatusBadge,
} from '../utils/formatters';

export default function DashboardManager() {
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);

  const {
    dateRange,
    setDateRange,
    chartViewMode,
    setChartViewMode,
    stats,
    revenueData,
    categoryData,
    recentOrders,
    lowStockProducts,
    topSellingProducts,
    orderStatusPipeline,
    paymentData,
    isLoading,
    aiModelInfo,
    aiMetrics,
    evaluationMetrics,
    isRetraining,
    trainingStatus,
    handleRetrainAi,
  } = useDashboardData();

  const handleExportReport = useCallback(() => {
    exportOverviewExcel({
      dateRange,
      stats,
      revenueData,
      categoryData,
      topSellingProducts,
      orderStatusPipeline,
      paymentData,
      aiModelInfo,
      aiMetrics,
      evaluationMetrics,
    });
  }, [
    dateRange,
    stats,
    revenueData,
    categoryData,
    topSellingProducts,
    orderStatusPipeline,
    paymentData,
    aiModelInfo,
    aiMetrics,
    evaluationMetrics,
  ]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-500 font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <span>Đang đồng bộ dữ liệu tổng quan thời gian thực...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-12 max-w-7xl mx-auto">
      <DashboardHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onExportReport={handleExportReport}
      />

      <AiRecommenderBanner
        aiModelInfo={aiModelInfo}
        aiMetrics={aiMetrics}
        stats={stats}
        isRetraining={isRetraining}
        trainingStatus={trainingStatus}
        onRetrainAi={handleRetrainAi}
        onOpenEvaluationModal={() => setIsEvaluationModalOpen(true)}
        formatPrice={formatDashboardPrice}
      />

      <AiEvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        metricsData={evaluationMetrics}
        onExportReport={handleExportReport}
      />

      <MetricCards stats={stats} formatPrice={formatDashboardPrice} />

      <OrderPipeline orderStatusPipeline={orderStatusPipeline} />

      <DashboardCharts
        revenueData={revenueData}
        categoryData={categoryData}
        chartViewMode={chartViewMode}
        setChartViewMode={setChartViewMode}
        formatPrice={formatDashboardPrice}
      />

      <TopProductsAndInventory
        topSellingProducts={topSellingProducts}
        paymentData={paymentData}
        lowStockProducts={lowStockProducts}
        formatPrice={formatDashboardPrice}
      />

      <RecentOrdersTable
        recentOrders={recentOrders}
        formatPrice={formatDashboardPrice}
        formatDate={formatDashboardOrderDate}
        getOrderStatusBadge={renderOrderStatusBadge}
      />
    </div>
  );
}
