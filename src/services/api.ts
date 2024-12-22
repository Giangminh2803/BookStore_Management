import axios from "services/axios.customize"

export const LoginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login"
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password }, {
        headers: {
            delay: 2000
        }
    })
}

export const RegisterAPI = (email: string, password: string, fullName: string, phone: string) => {
    const urlBackend = "/api/v1/user/register"
    return axios.post<IBackendRes<IRegister>>(urlBackend, { email, password, fullName, phone })
}

export const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account"
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend)
}

export const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout"
    return axios.post<IBackendRes<IRegister>>(urlBackend)
}