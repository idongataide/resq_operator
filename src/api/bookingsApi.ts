import { axiosAPIInstance } from "./interceptor";



export const getBookings = async (booking_type?: string) => {
  try {
    let endpoint = "/bookings";
    
    if (booking_type === "non-emergency") {
      endpoint = "/bookings/schedules";
    } else if (booking_type === "new-pending") {
      endpoint = "/bookings/new-pending";
    }
    
    return await axiosAPIInstance
      .get(endpoint)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


// Get booking counts
export const getBookingCounts = async () => {
  try {
    return await axiosAPIInstance
      .get(`/bookings/?component=count-status`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

// Get single booking
export const getBookingById = async (booking_id: string, booking_type?: string) => {
  try {
    const endpoint = booking_type === "non-emergency" 
      ? `/bookings/schedules/${booking_id}` 
      : `/bookings/${booking_id}`;
    return await axiosAPIInstance
      .get(endpoint)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const acceptBooking = async (data: {
  booking_id: string;
  lead_id?: string;
}) => {
  try {
    if (data.lead_id) {
      // Emergency booking
      return await axiosAPIInstance
        .post(`/bookings/assign-request`, {
          booking_id: data.booking_id,
          lead_id: data.lead_id,
        })
        .then((res) => res?.data);
    } else {
      // Non-emergency booking
      return await axiosAPIInstance
        .post(`/bookings/accept-schedule`, {
          booking_id: data.booking_id,
        })
        .then((res) => res?.data);
    }
  } catch (error) {
    return error;
  }
};

export const cancelBooking = async (data: {
  booking_id: string;
  reason?: string;
  isEmergency?: boolean;
}) => {
  try {
    const endpoint = data.isEmergency ? `/bookings/cancel-request` : `/bookings/decline-schedule`;
    return await axiosAPIInstance
      .post(endpoint, {
        booking_id: data.booking_id,
        reason: data.reason,
      })
      .then((res) => res?.data);
  } catch (error) {
    return error;
  }
};


export const assignBookingRequest = async (data: {
  booking_id: string;
  lead_id: string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`/bookings/assign-request`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


export const updateBookingLocation = async (data: {
  booking_id: string;
  pickup_address?: string;
  dropoff_address?: string;
  start_coord?: {
    latitude: number;
    longitude: number;
  };
  end_coord?: {
    latitude: number;
    longitude: number;
  };
}) => {
  try {
    const response = await axiosAPIInstance.post("/bookings/update-location", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getBookingTimeline = async (booking_id: string) => {
  try {
    const response = await axiosAPIInstance.get(`/bookings/${booking_id}/timeline`);
    return response.data;
  } catch (error) {
    throw error;
  }
};