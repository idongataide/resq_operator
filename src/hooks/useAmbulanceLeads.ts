import { getAmbulanceLeads, getAmbulanceLeadsSearch } from "@/api/ambulanceLeadsApi";
import useSWR from "swr";


interface AmbulanceLeadsParams {
  online?: string;
  type?: string;
}

export const useAmbulanceLeads = (type?: 'lead' | 'driver') => {
  const { data, isLoading, mutate } = useSWR(
    type ? `/providers/ambulance-leads?type=${type}` : "/providers/ambulance-leads",
    () => {
      return getAmbulanceLeads(type).then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    }
  );

  return { data, isLoading, mutate };
};

export const useAmbulanceLeadsSearch = (params?: AmbulanceLeadsParams) => {
  
  const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  
  const { data, isLoading, mutate } = useSWR(
    `/accounts/lead-lists${queryString}`,
    () => getAmbulanceLeadsSearch(params),
    {
      revalidateOnFocus: false,
    }
  );

  return { data, isLoading, mutate };
};