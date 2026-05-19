// OperatorRevenue.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Table } from "antd";
import { FiClock, FiDollarSign } from "react-icons/fi";
import { useRevenuePayout } from "@/hooks/useRevenue";
import LoadingScreen from '@/pages/dashboard/common/LoadingScreen';
import DateRangeFilter, { type Period } from '@/components/ui/DateRangeFilter';

interface OperatorRevenueProps {
  isNonEmergency?: boolean;
}

const OperatorRevenue: React.FC<OperatorRevenueProps> = ({ isNonEmergency = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('yearly');
  const [dateRange, setDateRange] = useState<{ start_date: string; end_date: string }>({
    start_date: '',
    end_date: ''
  });

  // Function to calculate date range based on selected period
  const calculateDateRange = (period: Period) => {
    const today = new Date();
    let startDate = new Date();
    const endDate = new Date();

    switch (period) {
      case 'weekly':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'yearly':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
    }

    setDateRange({
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    });
  };

  // Update date range when period changes
  useEffect(() => {
    calculateDateRange(selectedPeriod);
  }, [selectedPeriod]);

  // Use the custom hook for API call
  const { data, isLoading, pagination } = useRevenuePayout({
    isNonEmergency,
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    page: currentPage,
  });

  // Process data for table - matching the actual API response structure
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item: any, index: number) => ({
      key: item.provider_id || item.id || index,
      dateJoined: item.dateJoined || item.created_at || 'N/A',
      operatorName: item.name || item.operator_name || item.full_name || 'N/A',
      operatorEarning: item.total_amount || item.operator_earning || 0,
      totalRequest: item.total_request || item.total_requests || 0,
      totalCompleted: item.total_completed || 0,
    }));
  }, [data]);

  // Table columns
  const columns = useMemo(() => [
    {
      title: "Date Joined",
      dataIndex: "dateJoined",
      key: "dateJoined",
      sorter: (a: any, b: any) => {
        const dateA = new Date(a.dateJoined).getTime();
        const dateB = new Date(b.dateJoined).getTime();
        return dateA - dateB;
      },
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <FiClock className="text-gray-400" />
          <span>{text !== 'N/A' ? new Date(text).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
        </div>
      ),
    },
    {
      title: "Operator Name",
      dataIndex: "operatorName",
      key: "operatorName",
      sorter: (a: any, b: any) => a.operatorName.localeCompare(b.operatorName),
    },
    {
      title: "Total Completed",
      dataIndex: "totalCompleted",
      key: "totalCompleted",
      sorter: (a: any, b: any) => (a.totalCompleted || 0) - (b.totalCompleted || 0),
      render: (value: number) => value?.toLocaleString() || '0',
    },
    {
      title: "Total Request",
      dataIndex: "totalRequest",
      key: "totalRequest",
      sorter: (a: any, b: any) => (a.totalRequest || 0) - (b.totalRequest || 0),
      render: (value: number) => value?.toLocaleString() || '0',
    },
    {
      title: "Operator Earning",
      dataIndex: "operatorEarning",
      key: "operatorEarning",
      sorter: (a: any, b: any) => (a.operatorEarning || 0) - (b.operatorEarning || 0),
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <FiDollarSign className="text-gray-400" />
          <span className="font-medium">₦{value?.toLocaleString() || '0'}</span>
        </div>
      ),
    },
  ], []);

  // Get total from pagination object
  const totalItems = pagination?.total || processedData.length;
  const currentPageFromPagination = pagination?.current_page || currentPage;
  const hasValidPagination = totalItems > pageSize;

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
  };

  if (isLoading && processedData.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header with Filter */}
      <div className="p-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-[#354959] uppercase text-md font-bold">
            Revenue per Operator
          </h1>  
          <DateRangeFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            periods={['weekly', 'monthly', 'yearly']}
            variant="outline"
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={processedData}
        pagination={hasValidPagination ? {
          current: currentPageFromPagination,
          pageSize: pageSize,
          total: totalItems,
          showTotal: (total) => `Total ${total} operators`,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handlePageChange,
        } : false}
        className="border-none p-4"
        rowClassName="hover:bg-gray-50 transition-colors"
        scroll={{ x: 'max-content' }}
        loading={isLoading && processedData.length > 0}
      />
    </div>
  );
};

export default OperatorRevenue;