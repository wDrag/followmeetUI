import Posts from "../../components/posts/posts";
import "./search.scss";
import { useContext, useEffect, useState } from "react";
import ax from "../../../axios";

const Search = () => {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  const [posts, setPosts] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchQuery = e.target.elements.search.value;
    try {
      const res = await ax.get(
        `${API_ENDPOINT}/api/search?query=${searchQuery}`
      );
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <div className="search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          placeholder="Search"
          onKeyDown={handleEnter}
        />
        <button type="submit">Search</button>
      </form>
      <Posts posts={posts} />
    </div>
  );
};

export default Search;
