import axios from '@/services/axios.customize'

export const getBooksAPI = (query: string) => {
    const urlBackend = `/api/v1/book?${query}`
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend)
}

export const deleteBooksAPI = (id: string) => {
    const urlBackend = `/api/v1/book/${id}`
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}