import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import AcademyCard from "../components/AcademyCard";
import Spinner from "../components/Spinner";

const Academies = () => {
    const { academies, isLoading, errorMessage } = useOutletContext();
    const [search, setSearch] = useState("");

    const filteredAcademies = academies.filter(academy =>
        academy.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-5 flex flex-col justify-center items-center">
            <div className="flex items-center gap-2 w-1/2">
                <input
                    type="text"
                    placeholder="Search Academies"
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button
                    type="button"
                    disabled
                    className="cursor-pointer hover:bg-blue-600 text-white rounded-lg p-2 transition flex items-center justify-center"
                    tabIndex={-1}
                >
                    <img src="../public/search.svg" alt="search" className="w-5 h-5" />
                </button>
            </div>
            <div className="mt-5 w-full">
                <h1 className="text-xl font-bold mb-6">Our Academies</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center items-center">
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500 mb-6">{errorMessage.toString()}</p>
                    ) : (
                        filteredAcademies.map(academy => (
                            <AcademyCard key={academy.id} academy={academy} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Academies;