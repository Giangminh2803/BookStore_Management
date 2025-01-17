import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "src/index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import "styles/global.scss"
import AboutPage from 'pages/client/about'
import Layout from 'src/layout'
import BookPage from 'pages/client/book'
import LoginPage from 'pages/client/auth/login'
import RegisterPage from 'pages/client/auth/register'
import HomePage from 'pages/client/home'
import { App, ConfigProvider } from 'antd';
import { AppProvider } from 'components/context/app.context';
import { ProtectedRoute } from '@/components/auth';
import LayoutAdmin from 'components/layout/layout.admin';
import DashBoardPage from '@/pages/admin/dashboard';
import ManageBookPage from '@/pages/admin/manage.book';
import ManageUserPage from '@/pages/admin/manage.user';
import ManageOrderPage from '@/pages/admin/manage.order';
import enUS from 'antd/locale/en_US';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/book/:id",
        element: <BookPage />,
       
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <div>checkout page</div>
          </ProtectedRoute>
        ),
      }
    ]
  },
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "book",
        element: (
          <ProtectedRoute>
            <ManageBookPage />
          </ProtectedRoute>
        )
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <ManageOrderPage />
          </ProtectedRoute>
        )
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <div>admin page</div>
          </ProtectedRoute>
        ),
      },

    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <ConfigProvider locale={enUS}>
        <RouterProvider router={router} />
        </ConfigProvider>
      </AppProvider>
    </App>
  </StrictMode>,
)
