// hooks/useAdminUsers.ts
import useSWR from "swr";
import { getAdminUsers } from "@/api/teamsApi";

export const useAdminUsers = () => {
  const { data, isLoading, error, mutate } = useSWR(
    "/accounts/team-lists",
    getAdminUsers,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    users: data?.status === "ok" ? data?.data : [],
    isLoading,
    error,
    mutate,
  };
};