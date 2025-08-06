import { useNavigate } from "react-router-dom"
const AcademyCard = ({ academy }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-white shadow rounded p-4 hover:shadow-lg transition">
      <img
        className="w-full h-96 object-cover rounded"
        src={academy.logo}
        alt={academy.name}
      />
      <h2 className="font-bold text-lg mt-3">{academy.name}</h2>
      <hr className="my-3" style={{borderColor: "#ccc"}}/>
      <button onClick={() => navigate(`/academy/${academy.id}`)} className="p-2 rounded mt-3 cursor-pointer transition hover:bg-blue-600 hover:text-white">View Details</button>
    </div>
  );
};

export default AcademyCard
