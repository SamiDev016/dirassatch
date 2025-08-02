

const UserCard = ({user}) => {
    return (
        <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-white shadow-md rounded-xl p-6 hover:shadow-xl transition border border-blue-100">
            <div className="mb-4">
                <img
                    className="w-24 h-24 rounded-full border-4 border-blue-200 shadow-sm object-cover"
                    src={user.profilePhoto}
                    alt={user.firstName}
                />
            </div>
            <h1 className="text-xl font-bold text-blue-700 mb-1">{user.firstName} {user.lastName}</h1>
            <span className="text-sm text-gray-500 mb-2 cursor-pointer hover:text-blue-500 transition border border-blue-500 p-2 rounded" onClick={() => window.location.href = `mailto:${user.email}`}>Contact Owner</span>
        </div>
    )
}

export default UserCard
