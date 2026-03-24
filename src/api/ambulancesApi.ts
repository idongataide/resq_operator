import { axiosAPIInstance } from "./interceptor";

export const getAmbulances = async () => {
  try {
    return await axiosAPIInstance
      .get(`/accounts/ambulances`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

// Get booking counts
export const getAmbulanceCounts = async () => {
  try {
    return await axiosAPIInstance
      .get(`/accounts/ambulances/?component=count`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const addAmbulance = async (data: {
  plate_number: string;
  color: string;
  model: string;
  ambulance_type: string;
  lead_id: string;
}) => {
  try {
    return await axiosAPIInstance
      .post(`/accounts/ambulances`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateAmbulance = async (ambulance_id: string, data: {
  plate_number?: string;
  color?: string;
  model?: string;
  ambulance_type?: string;
  lead_id?: string;
}) => {
  try {
    return await axiosAPIInstance
      .put(`/accounts/ambulances/${ambulance_id}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};
export const deleteAmbulance = async (ambulance_id: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/accounts/ambulances/${ambulance_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getAmbulanceById = async (ambulance_id: string) => {
  try {
    return await axiosAPIInstance
      .get(`/accounts/ambulances/${ambulance_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};