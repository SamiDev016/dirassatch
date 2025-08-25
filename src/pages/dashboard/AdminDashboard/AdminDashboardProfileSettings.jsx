
import Header from "../../../components/dashboard/Header";
import Sidebar from "../../../components/dashboard/Sidebar";
import Footer from "../../../components/dashboard/Footer";



const AdminDashboardProfileSettings = () => {
    return(
        <div>
            <Header />
            <div className="flex flex-row">
                <Sidebar />
                <main className="w-4/5 h-screen border-l border-gray-200 p-5">
                    <h1></h1>
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default AdminDashboardProfileSettings