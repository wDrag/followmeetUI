import ax from "../../../axios.js";
import { useEffect, useState } from 'react';
import TrashPosts from "../../components/posts/trashPosts.jsx";
import "./trashcan.scss";

const TrashCan = () => {

    const [posts, setPosts] = useState([]);

    const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await ax.get(`${API_ENDPOINT}/api/post/getDeletedPosts`);
                setPosts(res.data);
            } catch (err) {
                console.log(err);

            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="trashCanContainer">
            <h1 className="trashCanTitle">Trash Can</h1>
            <TrashPosts posts={posts} />
        </div>
    );
}

export default TrashCan;