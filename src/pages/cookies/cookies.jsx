import React, { useEffect } from "react";
import ax from "../../../axios";

const Cookies = () => {
    const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

    useEffect(() => {
        console.log("Cookies");
        ax.get(`${API_ENDPOINT}/cookies`)
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
