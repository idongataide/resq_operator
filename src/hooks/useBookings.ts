import useSWR from "swr";
import { getBookings, getBookingCounts, getBookingById } from  "@/api/bookingsApi";


export const useBookings = (booking_type?: string) => {
  // Determine the endpoint based on booking_type
  let endpoint = "/bookings";
  
  if (booking_type === "non-emergency") {
    endpoint = "/bookings/schedules";
  } else if (booking_type === "new-pending") {
    endpoint = "/bookings/new-pending";
  }
  
  const { data, isLoading, mutate } = useSWR(
    endpoint,
    () => getBookings(booking_type),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.status === 'ok' ? data?.data : [],
    isLoading,
    mutate,
  };
};

export const useBookingCounts = () => {
  const { data, isLoading, mutate } = useSWR(
    "/bookings/?component=count-status",
    () => getBookingCounts(),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.status === 'ok' ? data?.data : null,
    isLoading,
    mutate,
  };
};

export const useBooking = (booking_id: string | undefined, booking_type?: string) => {
  const { data, isLoading, mutate } = useSWR(
    booking_id ? (booking_type === "non-emergency" ? `/bookings/schedules/${booking_id}` : `/bookings/${booking_id}`) : null,
    () => booking_id ? getBookingById(booking_id, booking_type) : null,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    booking: data?.status === 'ok' ? data?.data : null,
    isLoading,
    mutate,
  };
};