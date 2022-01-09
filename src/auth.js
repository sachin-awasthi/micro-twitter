import axios from "axios";

async function auth() {
    const url = '/';

    //withCredentials allow storing cookie in browser
    return await axios.get(url, { withCredentials: true })
        .then(function (response) {
            if (response.data !== "Access denied") {
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
