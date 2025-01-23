export {};

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  interface ILogin {
    access_token: string;
    user: {
      email: string;
      phone: string;
      fullName: string;
      role: string;
      avatar: string;
      id: string;
    };
  }

  interface IRegister {
    _id: string;
    email: string;
    fullName: string;
  }
  interface IUpdate {
    data: any;
  }
  interface IResponseBulk {
    countSuccess: number;
    countError: number;
    detail: any;
  }

  interface IUser {
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    id?: string;
    isActive?: boolean;
    createdAt?: Date;
  }
  interface IDashboard{
    countOrder: number,
    countUser: number,
    countBook: number
  }

  interface IFetchAccount {
    user: IUser;
  }

  interface IUserTable {
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    _id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  interface ICategory {
    name: string[];
  }

  interface IBookTable {
    _id: string;
    thumbnail: string;
    slider: any;
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface ICart {
    _id: string;
    quantity: number;
    detail: IBookTable;
  }

  interface IOrder {
    _id?: string;
    name: string;
    email?: string;
    address: string;
    userId?: string;
    phone: string;
    totalPrice: number;
    type: string;
    detail: {
      bookName: string;
      quantity: number;
      _id: string;
    }[];
    totalPrice?: number;
    paymentStatus?: string;
    paymentRef?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

}
