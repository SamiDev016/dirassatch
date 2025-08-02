


const PostCard = ({ post }) => {
    return (
        <div className="flex flex-col bg-white shadow rounded-lg p-4 hover:shadow-xl transition mb-6 max-w-md mx-auto border border-gray-100" >
            <div className="flex items-center gap-3 mb-2">
                <a href={`/academy/${post.academy.id}`}><img src={post.academy.logo} alt={post.academy.name} className="w-10 h-10 rounded-full border border-gray-200" /></a>
                <div>
                    <a href={`/academy/${post.academy.id}`}><span className="font-semibold text-gray-800">{post.academy.name}</span></a>
                    <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
            <img className="w-full h-56 object-cover rounded-md mb-3" src={post.photo} alt={post.title} />
            <span className="font-bold text-lg mb-1 text-gray-900">{post.title}</span>
            <p className="text-gray-700 text-sm mb-2 whitespace-pre-line">{post.content}</p>
        </div>
    )
}

export default PostCard