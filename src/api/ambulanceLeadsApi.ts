import { axiosAPIInstance } from "./interceptor";

export const getAmbulanceLeads = async () => {
  try {
    return await axiosAPIInstance
      .get(`/accounts/lead-lists`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getAmbulanceLeadsSearch = async (params?: { online?: string; type?: string }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.online) queryParams.append('online', params.online);
    if (params?.type) queryParams.append('type', params.type);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/accounts/lead-lists?${queryString}` : '/accounts/lead-lists';
    
    return await axiosAPIInstance
      .get(url)
      .then((res) => {
        return res?.data?.data;
      });
  } catch (error) {
    return error;
  }
};

export const addAmbulanceLead = async (data: { 
  full_name: string;
  phone_number: string;
  emergency_contact: string;
  residential_address: string;
  email?: string;
  type: string;

}) => {
  try {
    return await axiosAPIInstance
      .post(`/accounts/lead-lists`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateAmbulanceLead = async (lead_id: string, data: { 
  full_name: string;
  phone_number: string;
  emergency_contact: string;
  residential_address: string;
  email?: string;
  type: string;
}) => {
  try {
    return await axiosAPIInstance
      .put(`/accounts/lead-lists/${lead_id}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteAmbulanceLead = async (lead_id: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/accounts/lead-lists/${lead_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getAmbulanceLeadById = async (lead_id: string) => {
  try {
    return await axiosAPIInstance
      .get(`/accounts/lead-lists/${lead_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};