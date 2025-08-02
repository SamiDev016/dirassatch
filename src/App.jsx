
import './App.css'
import { useState, useEffect } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import { Outlet } from 'react-router-dom'



const App = () => {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [academies, setAcademies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const fetchAcademies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/academy/all`);
      if(!response.ok){
        throw new Error("Failed to fetch academies.");
      }
      const data = await response.json();
      if(data.Response === "False"){
        setErrorMessage(data.Message);
      }
      setAcademies(data.slice(0, 8));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message || "Failed to academies.");
    }
  };
///post/all
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/post/all`);
      if(!response.ok){
        throw new Error("Failed to fetch posts.");
      }
      const data = await response.json();
      if(data.Response === "False"){
        setErrorMessage(data.Message);
      }
      setPosts(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message || "Failed to posts.");
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchAcademies();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <Outlet context={{
        search,
        setSearch,
        academies,
        errorMessage,
        isLoading,
        posts
      }} />
      <Footer />
    </div>
  );
};

export default App
