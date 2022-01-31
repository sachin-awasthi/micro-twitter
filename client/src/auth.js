import axios from "axios";

async function auth() {
    const url = 'https://micro-twitter-server.herokuapp.com/';

    //withCredentials allow storing cookie in browser
    return await axios.get(url, { withCredentials: true })
        .then(function (response) {
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
