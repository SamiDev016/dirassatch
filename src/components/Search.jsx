const Search = ({search, setSearch}) =>{
    return(
        <div className="search flex gap-2">
            <input type="text" placeholder="Search Through Academies"
            className="w-80 p-2 rounded-md"
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            maxLength={20}
            />
            <img src="../public/search.svg" alt="search" className="w-5 h-5 cursor-pointer"/>
        </div>
    )
}
export default Search