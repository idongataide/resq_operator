import { axiosAPIInstance } from "./interceptor";

export const getLastma = async (type:any) => {
  try {
    return await axiosAPIInstance
      .get(`/accounts/admin-user?type=${type}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  } 
};

export const addTeams = async (data: any) => {
  try {
    return await axiosAPIInstance
      .post('/accounts/admin-user', data)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getLastmaCount = async (countStatus: string) => {
  try {
    return await axiosAPIInstance
      .get(`/accounts/admin-user?component=${countStatus}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};


export const bulkUploadLatsma = async (formData: FormData) => {
  try {
    return await axiosAPIInstance
      .post(`/users/bulk-lastma-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Accept' : 'application/form-data',
          'upload' : 'yes'
        },
      })
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};

export const deleteTeams = async (id: string) => {
  try {
    return await axiosAPIInstance
      .delete(`/accounts/admin-user/${id}`)
      .then((res) => {
        return res?.data;
      });
  } catch (error) {
    return error;
  }
};