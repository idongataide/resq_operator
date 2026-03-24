import { getAmbulanceLeads, getAmbulanceLeadsSearch } from "@/api/ambulanceLeadsApi";
import useSWR from "swr";


interface AmbulanceLeadsParams {
  online?: string;
  type?: string;
}

export const useAmbulanceLeads = () => {
  const { data, isLoading, mutate } = useSWR(
    "/providers/ambulance-leads",
    () => {
      return getAmbulanceLeads().then((res) => {
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