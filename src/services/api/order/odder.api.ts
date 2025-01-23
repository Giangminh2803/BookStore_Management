import axios from "@/services/axios.customize";

export const createOrderAPI = (data: IOrder) => {
    const urlBackend = '/api/v1/order'
    return axios.post<IBackendRes<IRegister>>(urlBackend, data);
};

export const getHistoryOrder = () => {
    const urlBackend = '/api/v1/history'
    return axios.get<IBackendRes<IOrder[]>>(urlBackend);
}

export const getOrderAPI = (query: string) => {
    const urlBackend = `/api/v1/order?${query}`
    return axios.get<IBackendRes<IModelPaginate<IOrder>>>(urlBackend);
}
