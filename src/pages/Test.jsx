import { useEffect , useState} from "react"
import { isLoggedIn, getToken } from "../utils/auth"
import { useNavigate } from "react-router-dom"
import Spinner from "../components/Spinner"
import Header from "../components/Header"
import Footer from "../components/Footer"
const Test = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_BASE = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "/api";
    useEffect(() => {
        if(!isLoggedIn()){
            navigate("/login");
        }
        const fetchUser = async () => {
            try {
                console.log(getToken());
                const response = await fetch(`${API_BASE}/user/me`, {
                    headers: {
                        "Authorization": `Bearer ${getToken()}`
                    }
                });
                console.log(response);
                if(!response.ok){
                    throw new Error("Failed to fetch user");
                }
                const data = await response.json();
                console.log(data);
                setUser(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);
    return(
        <div>
            <Header />
            {loading ? (
                <Spinner />
            ) : (
                <h1>You are Logged IN ... {user?.firstName}</h1>
            )}
            <Footer />
        </div>
    )
}

export default Test