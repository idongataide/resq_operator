// revenueMetrics.tsx
import Images from "@/components/images";
import { useRevenuesStat } from "@/hooks/useRevenue";
import React from "react";

interface RevenueMetricsProps {
  isNonEmergency?: boolean;
}


const RevenueMetrics: React.FC<RevenueMetricsProps> = ({ isNonEmergency = false }) => {
  // Fetch revenue statistics
  const { data:summary, isLoading } = useRevenuesStat({ 
    isNonEmergency,
    operatorEarning: 'inflow-earnings' 
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount?.toLocaleString() || '0'}`;
  };

  // Extract data from API response
  const revenueData = summary?.[0] || summary || {};
  
  const revenueMetrics = [
    {
      id: 'allTime',
      title: 'Total',
      value: formatCurrency(revenueData?.allTime || 0)
    },
    {
      id: 'thisWeek',
      title: 'This Week',
      value: formatCurrency(revenueData?.thisWeek || 0)
    },
    {
      id: 'thisMonth',
      title: 'This Month',
      value: formatCurrency(revenueData?.thisMonth || 0)
    },
    {
      id: 'thisQuarter',
      title: 'This Quarter',
      value: formatCurrency(revenueData?.thisQuarter || 0)
    }
  ];

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-4 gap-4 mb-6 bg-[#FFFFFF] p-4 rounded-lg">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#F6F8F9] rounded-lg p-4 animate-pulse">
              <div className="rounded-full bg-[#fff] p-2 w-10 h-10 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Revenue Metrics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6 bg-[#FFFFFF] p-4 rounded-lg">
        {revenueMetrics.map((metric) => (
          <div key={metric.id} className="bg-[#F6F8F9] rounded-lg p-4">
            <div className="rounded-full bg-[#fff] p-2 w-10 h-10 flex items-center justify-center mb-3">
              <img src={Images.icon.naira} alt="" />
            </div>  
            <div className="text-sm text-[#354959] mb-1">{metric.title}</div>
            <div className="text-2xl text-[#354959] font-semibold">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueMetrics;