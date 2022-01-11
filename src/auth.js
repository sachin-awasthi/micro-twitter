import axios from "axios";

async function auth() {
    const url = 'http://localhost:8080/';

    //withCredentials allow storing cookie in browser
    return await axios.get(url, { withCredentials: true })
        .then(function (response) {
            if (!response.status) return false;
            if (response.data === "User authorized") {
                return true;
            } else {
                return false;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

export default auth;
