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
import TeacherDashboard from './pages/dashboard/teacher/TeacherDashboard.jsx'
import StudentDashboard from './pages/dashboard/student/StudentDashboard.jsx'
import AcademyAdminDashboard from './pages/dashboard/academymanager/AcademyAdminDashboard.jsx'
import ProfileSettings from './pages/dashboard/ProfileSettings.jsx'
import AcademyDetails from './pages/dashboard/superadmin/AcademyDetails.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ChaptersAdmin from './pages/dashboard/academymanager/ChaptersAdmin.jsx'
import ModulesAdmin from './pages/dashboard/academymanager/ModulesAdmin.jsx'
import CoursesAdmin from './pages/dashboard/academymanager/CoursesAdmin.jsx'
import GroupsAdmin from './pages/dashboard/academymanager/GroupsAdmin.jsx'
import ProfileAdminDashboard from './pages/dashboard/academymanager/ProfileAdminDashboard.jsx'
import ManageAcademies from './pages/dashboard/superadmin/ManageAcademies.jsx'
import TeachersAdmin from './pages/dashboard/academymanager/TeachersAdmin.jsx'
import StudentsAdmin from './pages/dashboard/academymanager/StudentsAdmin.jsx'
import SectionsAdmin from './pages/dashboard/academymanager/SectionsAdmin.jsx'
import SeancesAdmin from './pages/dashboard/academymanager/SeanceAdmin.jsx'
import ExamsAdmin from './pages/dashboard/academymanager/ExamsAdmin.jsx'










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
        path: 'super-admin/academies',
        element: (
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <ManageAcademies />
          </ProtectedRoute>
        ),
      },
      {
        path: 'academy/:academyId/admin',
        element: (
          <ProtectedRoute allowedRoles={["manager", "owner"]}>
            <AcademyAdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'academy/:academyId/admin/settings',
        element: (
          <ProtectedRoute allowedRoles={["manager", "owner"]}>
            <ProfileAdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'academy/:academyId/admin/chapters',
        element: (
          <ProtectedRoute allowedRoles={["manager", "owner"]}>
            <ChaptersAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: 'academy/:academyId/admin/modules',
        element: (
          <ProtectedRoute allowedRoles={["manager", "owner"]}>
            <ModulesAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: 'academy/:academyId/admin/courses',
        element: (
          <ProtectedRoute allowedRoles={["manager", "owner"]}>
            <CoursesAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: 'academy/:academyId/admin/groups',
        element: (
          <ProtectedRoute allowedRoles={["manager", "owner"]}>
            <GroupsAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: 'academy/:academyId/admin/sections',
        element: (
          <ProtectedRoute allowedRoles={["manager", "owner"]}>
            <SectionsAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: 'academy/:academyId/admin/seances',
        element: (
          <ProtectedRoute allowedRoles={["manager", "owner"]}>
            <SeancesAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: 'academy/:academyId/admin/exams',
        element: (
          <ProtectedRoute allowedRoles={["manager", "owner"]}>
            <ExamsAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: 'academy/:academyId/admin/teachers',
        element: (
          <ProtectedRoute allowedRoles={["manager", "owner"]}>
            <TeachersAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: 'academy/:academyId/admin/students',
        element: (
          <ProtectedRoute allowedRoles={["manager", "owner"]}>
            <StudentsAdmin />
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
      
      

      { path: 'profile', element: <ProfileSettings /> },
    ]
  }
  

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
