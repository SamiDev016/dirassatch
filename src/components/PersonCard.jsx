

const PersonCard = ({person}) => {
    return (
        <div className="flex flex-col bg-white shadow rounded p-4 hover:shadow-lg transition">
            <img className="w-full h-48 object-cover rounded" src={person.coverPhoto} alt={person.name} />
            <h2 className="font-bold text-lg mt-3">{person.name}</h2>
        </div>
    )
}

export default PersonCard
