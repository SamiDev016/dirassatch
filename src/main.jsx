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
import Contact from './pages/Contact.jsx'
import Test from './pages/Test.jsx'
import DashboardLayout from './pages/dashboard/layouts/DashboardLayout.jsx'
import DashboardHome from './pages/dashboard/DashboardHome.jsx'
import SuperAdminDashboard from './pages/dashboard/superadmin/SuperAdminDashboard.jsx'
import TeacherDashboard from './pages/dashboard/TeacherDashboard.jsx'
import StudentDashboard from './pages/dashboard/StudentDashboard.jsx'
import AcademyAdminDashboard from './pages/dashboard/academymanager/AcademyAdminDashboard.jsx'
import ProfileSettings from './pages/dashboard/ProfileSettings.jsx'
import AcademyDetails from './pages/dashboard/superadmin/AcademyDetails.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'




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
    path: '/contact',
    element:<Contact />
  },
  {
    path: '/test',
    element:<Test />
  },


  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardHome /> },

      {
        path: 'super-admin',
        element: (
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'super-admin/academy/:academyId',
        element: (
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <AcademyDetails />
          </ProtectedRoute>
        ),
      },

      { 
        path: 'academy/:academyId/teacher', 
        element: (
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        ),
      },
      { 
        path: 'academy/:academyId/student', 
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      { path: 'academy/:academyId/admin', element: <AcademyAdminDashboard /> },

      { path: 'profile', element: <ProfileSettings /> },
    ]
  }
  

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
