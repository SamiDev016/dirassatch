const Search = ({ search = '', setSearch = () => {} }) => {
  return (
    <div className="text-lg flex items-center gap-2 w-full max-w-lg mx-auto bg-white border border-gray-300 rounded-full shadow-sm px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
      <input
        type="text"
        placeholder="Looking for a specifique course?"
        className="flex-1 bg-transparent outline-none px-2 py-1 text-gray-700 placeholder-gray-400 font-medium"
        value={search}
        onChange={e => setSearch(e.target.value)}
        maxLength={20}
      />
      <button type="button" className=" cursor-pointer hover:bg-blue-600 text-white rounded-full p-2 transition flex items-center justify-center">
        <img src="../public/search.svg" alt="search" className="w-5 h-5" />
      </button>
    </div>
  );
}
export default Search