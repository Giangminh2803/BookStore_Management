import axios from "services/axios.customize"

export const getAmountAPI = () => {
    const urlBackend = "/api/v1/database/dashboard"
    return axios.get<IBackendRes<IDashboard>>(urlBackend)
}