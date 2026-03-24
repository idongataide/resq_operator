import { getActivity } from "@/api/activityApi";
import useSWR from "swr";

export const useActivity = () => {
    const { data, isLoading, mutate } = useSWR(
      `/accounts/activity-logs/`,
      () => {
        return getActivity().then((res) => {
          return res?.data;
        });
      },
  
      {
        revalidateOnFocus: false,
      },
    );
  
    return { data, isLoading, mutate };
};