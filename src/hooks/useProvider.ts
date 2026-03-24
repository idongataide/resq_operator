import useSWR from "swr";
import { getProviders, getSingleProvider } from "@/api/providerApi";

export const useProviders = () => {
  const { data, isLoading, mutate } = useSWR(
    "/providers",
    () => {
      return getProviders().then((res) => {
        return res?.data;
      });
    },
    {
      revalidateOnFocus: false,
    }
  );

  return { data, isLoading, mutate };
};

export const useSingleProvider = (provider_id: string | undefined) => {
  const { data, isLoading, error, mutate } = useSWR(
    provider_id ? `/providers/${provider_id}` : null,
    () => provider_id ? getSingleProvider(provider_id) : null,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );

  return {
    provider: data?.status === 'ok' ? data?.data : null,
    isLoading,
    error,
    mutate,
    isError: error || data?.status !== 'ok'
  };
};