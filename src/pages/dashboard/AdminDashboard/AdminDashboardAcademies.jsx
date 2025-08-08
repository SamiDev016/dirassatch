import Header from "../../../components/dashboard/Header"
import Sidebar from "../../../components/dashboard/Sidebar"
import Footer from "../../../components/dashboard/Footer"
import { useState } from "react";

const AdminDashboardAcademies = () => {

    const [academy, setAcademy] = useState({});

    const addAcademy = async (e) => {

    }

//   "id": 1,
//   "name": "JOMJ",
//   "logo": "https://storage.googleapis.com/daracademyfireproject.appspot.com/academy_logo/06060aa0-9e3c-4098-987e-aa92b2509378.jpg",
//   "phone": null,
//   "email": null,
//   "owners": [
//     3,
//     4,
//     2
//   ]
// }



    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="w-full md:w-4/5 bg-gradient-to-tr from-blue-50 via-white to-blue-100 p-10 border-t border-blue-200 shadow-inner">
                    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8">
                        
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default AdminDashboardAcademies