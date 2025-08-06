
import Header from "../components/Header"
import Footer from "../components/Footer"

const Contact = () => {
    return (
        <div>
            <Header />
                <main className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 border-t border-blue-200 shadow-inner">
                    <div className="flex flex-col gap-4 p-4 w-1/2 mx-auto">
                        <h1 className="text-2xl font-bold text-center mb-6 text-blue-500">Contact Us</h1>
                        <form action="" className="flex flex-col gap-4">
                            <input type="text" placeholder="Name" className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            <input type="email" placeholder="Email" className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            <select name="subject" id="subject" className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option value="">Select Subject</option>
                                <option value="Academy">Request To Add Your Academy With Us</option>
                                <option value="Course">Reclamation</option>
                                <option value="Other">Other</option>
                            </select>
                            <textarea name="message" placeholder="Your Message" id="message" cols="30" rows="10" className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
                            <button type="submit" className="p-3 rounded bg-blue-500 text-white hover:bg-blue-600 transition font-semibold disabled:opacity-60">Send</button>
                        </form>
                    </div>
                </main>
            <Footer />
        </div>
    )
}

export default Contact
