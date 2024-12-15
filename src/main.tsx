import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Layout from './layout'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/book",
        element: <div>Book Page</div>,
      },
      {
        path: "/about",
        element: <div>about page</div>,
      },

    ]
  },
  {
    path: "/login",
    element: <div>Login Page</div>,

  },
  {
    path: "/register",
    element: <div>Register Page</div>,
  },

]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
