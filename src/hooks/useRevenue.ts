// hooks/revenue/useOperatorRevenue.ts
import { getOperatorRevenue, getRemittedRevenue, getStakeholderRevenue, getRevenuePayout, getRevenuesStat } from '@/api/revenueApi';
import useSWR from 'swr';


export const useOperatorRevenue = (params?: {
  isNonEmergency?: boolean;
  period?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
}) => {
  const { isNonEmergency, ...restParams } = params || {};
  
  // Choose endpoint based on emergency/non-emergency
  const endpoint = isNonEmergency 
    ? '/payments/schedule-daily-revenue-operator'
    : '/payments/daily-revenue-operator';

  const { data, isLoading, mutate } = useSWR(
    params ? [endpoint, restParams] : null,
    () => getOperatorRevenue(endpoint, restParams),
    {
      revalidateOnFocus: false,
    },
  );

  return { data: data?.data || [], summary: data?.summary, pagination: data?.pagination, isLoading, mutate };
};


export const useRevenuePayout = (params?: {
  isNonEmergency?: boolean;
  period?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
}) => {
  const { isNonEmergency, ...restParams } = params || {};
  
  // Choose endpoint based on emergency/non-emergency
  const endpoint = isNonEmergency 
    ? '/bookings/schedule-get-revenue-per-operator'
    : '/bookings/get-revenue-per-operator';

  const { data, isLoading, mutate } = useSWR(
    params ? [endpoint, restParams] : null,
    () => getRevenuePayout(endpoint, restParams),
    {
      revalidateOnFocus: false,
    },
  );

  return { data: data?.data || [], summary: data?.summary, pagination: data?.pagination, isLoading, mutate };
};




export const useStakeholderRevenue = (params?: {
  isNonEmergency?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  item_per_page?: number;
}) => {
  const { isNonEmergency, ...restParams } = params || {};
  
  const endpoint = isNonEmergency 
    ? '/payments/schedule-stakeholder-revenue'
    : '/payments/stakeholder-revenue';

  const { data, isLoading, mutate } = useSWR(
    params ? [endpoint, restParams] : null,
    () => getStakeholderRevenue(endpoint, restParams),
    {
      revalidateOnFocus: false,
    },
  );

  return { data: data?.data || [], summary: data?.summary, pagination: data?.pagination, isLoading, mutate };
};
// Fixed useRevenuesStat hook
export const useRevenuesStat = (params?: {
  isNonEmergency?: boolean;
  operatorEarning?: string;
}) => {
  const { isNonEmergency, operatorEarning, ...restParams } = params || {};
  
  // Fix the endpoint construction
  const endpoint = isNonEmergency 
    ? `/bookings?component=${operatorEarning || 'inflow-earnings'}`
    : `/bookings?component=${operatorEarning || 'inflow-earnings'}`;
  
  const { data, isLoading, mutate } = useSWR(
    params ? [endpoint, restParams] : null,
    () => getRevenuesStat(endpoint, restParams),
    {
      revalidateOnFocus: false,
    },
  );

  return { 
    data: data?.data || [], 
    pagination: data?.pagination, 
    isLoading, 
    mutate 
  };
};


export const useRemittedRevenue  = (params?: {
  isNonEmergency?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  item_per_page?: number;
}) => {
  const { isNonEmergency, ...restParams } = params || {};
  
  // Choose endpoint based on emergency/non-emergency
  const endpoint = isNonEmergency 
    ? '/payments/schedule-stakeholder-daily-revenue'
    : '/payments/stakeholder-daily-revenue';

  const { data, isLoading, mutate } = useSWR(
    params ? [endpoint, restParams] : null,
    () => getRemittedRevenue(endpoint, restParams),
    {
      revalidateOnFocus: false,
    },
  );

  return { data: data?.data || [], summary: data?.summary, pagination: data?.pagination, isLoading, mutate };
};