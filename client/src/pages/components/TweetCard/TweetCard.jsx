import React from 'react';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import "./TweetCard.css";

function TweetCard({ value }) {
    if (!value) return <></>;
    let { tweet_id, tweet_content, created_by_name, created_by_username, created_at, avatar_color } = value;
    let profileLink = "https://twitter.com/" + created_by_username;

    let initials = created_by_name.split(" ");
    initials = initials.map((item) => item[0]);
    initials = initials.join("").substring(0, 2);

    let currentTime = new Date();
    let createdTime = new Date(created_at);

    let createdDiff = Math.floor((currentTime - createdTime) / (1000 * 3600));
    if (createdDiff < 1) {
        createdDiff = Math.floor((currentTime - createdTime) / (1000 * 60));
        if (createdDiff < 1) {
            createdDiff = Math.floor((currentTime - createdTime) / (1000));
            createdDiff += "s ago";
        } else {
            createdDiff += "m ago";
        }
    } else {
        createdDiff += "h ago";
    }

    return (
        <div className="tweet-card">
            <div className="card-dp">
                <Avatar component={Paper} elevation={5} sx={{
                    bgcolor: avatar_color, fontSize: "1rem",
                    width: 40, height: 40, margin: "auto", '@media (max-width: 800px)': {
                        fontSize: "0.8rem", width: 30, height: 30
                    }
                }} >{initials}</Avatar>
            </div>
            <div className="card-content">
                <div className="card-header">
                    <a href={profileLink} target="_blank">
                        <span className="created-name-span">{created_by_name}</span>
                        <span className="created-username-span">@{created_by_username}</span>
                    </a>
                    <span style={{ color: "gray", margin: "0 0.25rem" }}>.</span>
                    <p className="created-before">{createdDiff}</p>
                </div>
                <div className="card-tweet">
                    {tweet_content}
                </div>
            </div>
        </div>
    );
}

export default TweetCard;
