import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

function Home() {
    useEffect(async () => {
        // await loadData();
    }, []);

    async function loadData() {
        const url = 'http://localhost:8080/';

        axios.get(url, { withCredentials: true })
            .then(function (response) {
                console.log("qwerty");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div style={{ backgroundColor: "red", width: "500px", height: "500px" }}>
            hello
        </div>
    );
}

export default Home;