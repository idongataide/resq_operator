import { axiosAPIInstance } from "./interceptor";

export const getProviders = async () => {
  try {
    return await axiosAPIInstance
      .get(`/providers`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const addProvider = async (data: any) => {
  try {
    return await axiosAPIInstance
      .post(`providers`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteProvider = async (provider_id: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/providers/${provider_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const updateProvider = async (provider_id: string, data: any) => {
  try {
    return await axiosAPIInstance
      .put(`/providers/${provider_id}`, data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getSingleProvider = async (provider_id: string) => {
  try {
    return await axiosAPIInstance
      .get(`/providers/${provider_id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};