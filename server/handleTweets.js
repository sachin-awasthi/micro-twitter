const axios = require("axios");

async function fetchTweetsById(userId) {
    let url = `https://api.twitter.com/2/users/${userId}/tweets`;
    let config = {
        headers: { Authorization: `Bearer ${process.env.TOKEN}` }
    }

    let data = [];
    await axios.get(url, config)
        .then(function (response) {
            data = response.data.data;
        })
        .catch(function (error) {
            console.log(error);
        });

    return data;
}

module.exports = { fetchTweetsById };