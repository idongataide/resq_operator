import { axiosAPIInstance } from "./interceptor";

// api/invoiceApi.ts

export const createInvoice = async (data: {
  booking_id: string;
  service_rendered: string[];
}) => {
  try {
    const response = await axiosAPIInstance.post(
      `/bookings/invoice-schedule`,
      {
        booking_id: data.booking_id,
        service_rendered: data.service_rendered,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};