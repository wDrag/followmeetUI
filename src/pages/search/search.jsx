import Posts from "../../components/posts/posts";
import "./search.scss";
import { useContext, useEffect, useState } from "react";
import ax from "../../../axios";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  const [posts, setPosts] = useState([]);

  const [searchParams] = useSearchParams();

  const searchText = searchParams.get("searchText");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await ax.get(
          `${API_ENDPOINT}/api/search?query=${searchText}`
        );
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPost();
  }, []);

  return (
    <div className="search">
      <Posts posts={posts} />
    </div>
  );
};

export default Search;
