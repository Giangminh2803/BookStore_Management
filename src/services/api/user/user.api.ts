import axios from "services/axios.customize"


export const getUsersAPI = (query: string) => {
    const urlBackend = `/api/v1/user?${query}`
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
}

export const createUserAPI = (email: string, password: string, fullName: string, phone: string) => {
    const urlBackend = `/api/v1/user`
    return axios.post<IBackendRes<IRegister>>(urlBackend, { email, password, fullName, phone })
}

export const deleteUserAPI = (id: string) => {
    const urlBackend = `/api/v1/user/${id}`
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

export const bulkCreateUserAPI = (data: {
    fullName: string
    password: string
    email: string
    phone: string
}[]) => {
    const urlBackend = '/api/v1/user/bulk-create'
    return axios.post<IBackendRes<IResponseBulk>>(urlBackend, data)
}

export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
    const urlBackend = `/api/v1/user`
    return axios.put<IBackendRes<IUpdate>>(urlBackend, { _id, fullName, phone })
}