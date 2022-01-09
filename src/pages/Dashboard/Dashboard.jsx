import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

function Dashboard() {
    useEffect(async () => {
        // await loadData();
    }, []);

    async function loadData() {
        const url = '/';

        axios.get(url, { withCredentials: true })
            .then(function (response) {
                console.log("qwerty");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div>

        </div>
    );
}

export default Dashboard;