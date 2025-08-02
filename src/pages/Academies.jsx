import { useOutletContext } from "react-router-dom"
import AcademyCard from "../components/AcademyCard"
import Spinner from "../components/Spinner"

const Academies = () => {
    const {academies, isLoading, errorMessage} = useOutletContext();
    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-6">Trusted Academies</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {isLoading ? (
                    <Spinner />
                ) : (
                    errorMessage ? (
                        <p className="text-red-500 mb-6">{errorMessage.toString()}</p>
                    ) : (
                        academies.map(academy => (
                            <AcademyCard key={academy.id} academy={academy} />
                        ))
                    )
                )}
            </div>
        </div>
    )
}

export default Academies