import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Academies from './pages/Academies.jsx'
import Courses from './pages/Courses.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import AcademyDetail from './pages/AcademyDetail.jsx'
import About from './pages/About.jsx'
import Test from './pages/Test.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children:[
      {
        index:true,
        element:<Home />
      },
      {
        path: '/academies',
        element:<Academies />
      },
    ]
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/courses',
    element:<Courses />
  },
  {
    path: '/course/:id',
    element:<CourseDetails />
  },
  {
    path: '/academy/:id',
    element:<AcademyDetail />
  },
  {
    path: '/about',
    element:<About />
  },
  {
    path: '/test',
    element:<Test />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
