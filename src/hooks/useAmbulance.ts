import { getAmbulanceCounts, getAmbulances } from "@/api/ambulancesApi";

import useSWR from "swr";

export const useAmbulances = () => {
  const { data, isLoading, mutate } = useSWR(
    "/providers/ambulances",
    () => {
      return getAmbulances().then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    }
  );

  return { data, isLoading, mutate };
};

export const useAmbulanceCounts = () => {
  const { data, isLoading, mutate } = useSWR(
    "/providers/ambulances/?component=count",
    () => {
      return getAmbulanceCounts().then((res) => {
        return res?.data;
      }); 
    },
    {
      revalidateOnFocus: false,
    }
  );

    return { data, isLoading, mutate };
};