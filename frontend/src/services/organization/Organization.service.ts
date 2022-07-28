import API from '../API';

export const getOrganization = (id: number): Promise<any> => {
  return API.get(`/organization/${id}`).then((res) => res.data);
};

export const patchOrganization = (id: number, update: any): Promise<any> => {
  return API.patch(`/organization/${id}`, { ...update }).then((res) => res.data);
};