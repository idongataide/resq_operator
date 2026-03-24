// api/adminApi.ts

import { axiosAPIInstance } from "./interceptor";


export const createAdminUser = async (data: {
  full_name: string;
  email: string;
  phone_number?: string;
  position: string;
  access_level: string;
}) => {
  try {
    const response = await axiosAPIInstance.post("/accounts/team-lists", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminUser = async (auth_id: string, data: {
  full_name?: string;
  email?: string;
  phone_number?: string;
  position?: string;
  access_level?: string;
}) => {
  try {
    const response = await axiosAPIInstance.put(`/accounts/team-lists/${auth_id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const suspendAdminUser = async (auth_id: string, reason: string) => {
  try {
    const response = await axiosAPIInstance.post(`/accounts/team-lists/${auth_id}/suspend`, { reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminUsers = async () => {
  try {
    const response = await axiosAPIInstance.get("/accounts/team-lists");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminUser = async (auth_id: string) => {
  try {
    const response = await axiosAPIInstance.delete(`/accounts/team-lists/${auth_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminUserStatus = async (auth_id: string, data: {
  status: number; // 1 = active, 2 = suspended
  reason?: string;
  unsuspend_date?: string;
}) => {
  try {
    const response = await axiosAPIInstance.put(`/admins/accounts/team-lists/${auth_id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
