import axios from "@/services/axios.customize";

export const getBooksAPI = (query: string) => {
  const urlBackend = `/api/v1/book?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend);
};

export const getBookAPI = (id: string) => {
  const urlBackend = `/api/v1/book/${id}`;
  return axios.get<IBackendRes<IBookTable>>(urlBackend, {
    headers: {
      delay: 3000
    }
  });
};

export const deleteBooksAPI = (id: string) => {
  const urlBackend = `/api/v1/book/${id}`;
  return axios.delete<IBackendRes<IRegister>>(urlBackend);
};

export const getCategoryAPI = () => {
  const urlBackend = `/api/v1/database/category`;
  return axios.get<IBackendRes<string[]>>(urlBackend);
};

export const uploadFileAPI = (fileImg: any, folder: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios<IBackendRes<{ fileUploaded: string }>>({
    method: "post",
    url: `/api/v1/file/upload`,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data", "upload-type": folder },
  });
};

export const createBookAPI = (
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string,
  thumbnail: string,
  slider: string[]
) => {
  const urlBackend = `/api/v1/book`;
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    mainText,
    author,
    price,
    quantity,
    category,
    thumbnail,
    slider,
  });
};

export const updateBookAPI = (
    _id: string,
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string,
    thumbnail: string,
    slider: string[]
  ) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.put<IBackendRes<IRegister>>(urlBackend, {
      mainText,
      author,
      price,
      quantity,
      category,
      thumbnail,
      slider,
    });
  };
