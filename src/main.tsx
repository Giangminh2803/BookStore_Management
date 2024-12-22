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
import { App } from 'antd';
import { AppProvider } from 'components/context/app.context';
import { ProtectedRoute } from '@/components/auth';
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
        path: "/book",
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
            <div>Checkout page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <div>Admin page</div>
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
        <RouterProvider router={router} />
      </AppProvider>

    </App>
  </StrictMode>,
)
