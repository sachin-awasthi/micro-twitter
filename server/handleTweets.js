const axios = require("axios");

let config = {
    headers: { Authorization: `Bearer ${process.env.TOKEN}` }
}

async function getDataFromTwitterAPI(url) {
    let data = [];
    try {

        await axios.get(url, config)
            .then(function (response) {
                data.push(response.data.data);
            })
            .catch(function (error) { });
    } catch (e) {
        console.log(e);
    }

    return data;
}

async function getUserIdByUsername(username) {
    let url = `https://api.twitter.com/2/users/by/username/${username}`;
    return getDataFromTwitterAPI(url);
}

async function getFollowingByUserId(userId) {
    let url = `https://api.twitter.com/2/users/${userId}/following`;
    return getDataFromTwitterAPI(url);
}

async function getTweetsByUserId(userId) {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    date = date.toISOString();
    let url = `https://api.twitter.com/2/users/${userId}/tweets?start_time=${date}&tweet.fields=created_at`;
    return getDataFromTwitterAPI(url);
}

module.exports = { getUserIdByUsername, getFollowingByUserId, getTweetsByUserId };