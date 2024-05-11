import React, { useEffect } from "react";
import axios from "axios";

const Cookies = () => {
    const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

    useEffect(() => {
        console.log("Cookies");
        axios.get(`${API_ENDPOINT}/cookies`, { withCredentials: true })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

  // return text "hihi"
    return <div>hihi</div>;
};

export default Cookies;
