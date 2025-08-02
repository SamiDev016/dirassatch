

const CourseCard = ({course}) => {
    const openModel = () => {
        console.log(course)
    }
    return (
        <div className="flex flex-col bg-white shadow rounded p-4 hover:shadow-lg transition">
            <img className="w-full h-48 object-cover rounded" src={course.coverPhoto} alt={course.name} />
            <h1 className="font-bold text-lg mt-3">{course.name}</h1>
            {/* <a href={`/course/${course.id}`} className="bg-blue-500 text-white p-2 rounded mt-3 cursor-pointer hover:bg-blue-600 transition" target="_blank">View Details</a> */}
            <button onClick={openModel} className="bg-blue-500 text-white p-2 rounded mt-3 cursor-pointer hover:bg-blue-600 transition">Request Enrollment</button>
        </div>
    )
}

export default CourseCard;