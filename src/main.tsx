import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import "./styles/global.scss"
import AboutPage from './pages/client/about'
import Layout from './layout'
import BookPage from './pages/client/book'
import LoginPage from 'pages/client/auth/login'
import RegisterPage from './pages/client/auth/register'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
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
    <RouterProvider router={router} />
  </StrictMode>,
)
