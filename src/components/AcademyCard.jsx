const AcademyCard = ({ academy }) => {
  return (
    <div className="flex flex-col bg-white shadow rounded p-4 hover:shadow-lg transition">
      <img
        className="w-full h-48 object-cover rounded"
        src={academy.logo}
        alt={academy.name}
      />
      <h2 className="font-bold text-lg mt-3">{academy.name}</h2>
      <a href={`/academy/${academy.id}`} className="bg-blue-500 text-white p-2 rounded mt-3 cursor-pointer hover:bg-blue-600 transition">View Details</a>
    </div>
  );
};

export default AcademyCard
