import { useState, useEffect } from "react";
import axios from "axios";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import Snackbar from '@mui/material/Snackbar';
import { Button, IconButton, Tooltip } from "@mui/material";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import TweetCard from '../components/TweetCard/TweetCard';
import CreateCollection from '../components/CreateCollection/CreateCollection';
import ViewCollection from '../components/ViewCollection/ViewCollection';
import './Dashboard.css';

const names = [
    "Business",
    "Sports"
];


function Dashboard() {
    const [personName, setPersonName] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [following, setFollowing] = useState([]);
    const [headUser, setHeadUser] = useState({});
    const [editUserChange, setEditUserChange] = useState("");
    const [dataLoaded, setDataLoaded] = useState(null);
    const [editModeOn, setEditModeOn] = useState(null);
    const [createCollectionState, setCreateCollectionState] = useState(false);
    const [viewCollectionState, setViewCollectionState] = useState(false);
    const [myCollections, setMyCollections] = useState([]);

    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: ""
    });

    //tweet will contain -> tweet_id, tweet_text, created_at, created_by
    useEffect(() => {
        async function init() {
            const headuser = await getHeadUser();
            // await getCollections();
            await getTweets(headuser);
        }
        init();
    }, []);

    async function getCollections() {
        const url = "https://micro-twitter-server.herokuapp.com/getMyCollections";

        await axios.get(url, {
            headers: {
                "jwt-token": localStorage.getItem("jwt-token"),
                "current-user": localStorage.getItem("username")
            }, withCredentials: true
        })
            .then(function (response) {

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async function getHeadUser() {
        const url = "https://micro-twitter-server.herokuapp.com/getHeadUser";
        let headuser = "";
        await axios.get(url, {
            headers: {
                "jwt-token": localStorage.getItem("jwt-token"),
                "current-user": localStorage.getItem("username")
            }, withCredentials: true
        })
            .then(function (response) {
                headuser = response.data.headUser;
                setHeadUser({
                    "username": headuser,
                    "userlink": `https://twitter.com/${headuser}`
                });
                setEditUserChange(headuser);
            })
            .catch(function (error) {
                console.log(error);
            });
        return headuser;
    }

    async function updateHeadUser(user) {
        const url = "https://micro-twitter-server.herokuapp.com/updateHeadUser";
        const reqBody = {
            "headuser": user
        }
        await axios.post(url, reqBody, {
            headers: {
                "jwt-token": localStorage.getItem("jwt-token"),
                "current-user": localStorage.getItem("username")
            }, withCredentials: true
        })
            .then(function (response) { })
            .catch(function (error) {
                console.log(error);
            });
    }
    async function getTweets(user) {
        if (!user) user = localStorage.getItem("headUser");
        const url = `https://micro-twitter-server.herokuapp.com/getTweets/${user}`;

        //withCredentials: true to pass cookies
        await axios.get(url, {
            headers: {
                "jwt-token": localStorage.getItem("jwt-token"),
                "current-user": localStorage.getItem("username")
            },
            withCredentials: true
        })
            .then(function (response) {
                setDataLoaded(true);
                if (response.data.userFollowing) {
                    let finalFollowing = response.data.userFollowing;
                    finalFollowing.map((item) => {
                        item["avatar_color"] = generateAvatarColor(item.followingName);
                    });
                    setFollowing(finalFollowing);
                    setHeadUser({
                        "username": user,
                        "userlink": `https://twitter.com/${user}`
                    });
                    setEditUserChange(user);
                }
                if (response.data.allTweets) {
                    let finalTweets = processTweetsData(response.data.allTweets);
                    finalTweets.sort((a, b) => a["created_at"] >= b["created_at"] ? -1 : 1)
                    setTweets(finalTweets);
                } else {
                    setSnackbarState({
                        open: true,
                        message: response.data
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    function processTweetsData(tData) {
        const finalTweets = [];
        for (let t = 0; t < tData.length; t++) {
            let tweet = tData[t];
            let fTweets = tweet["fTweets"];
            let avatarColor = generateAvatarColor(tweet["fUsername"]);
            if (!fTweets) continue;

            for (let ft = 0; ft < fTweets.length; ft++) {
                let tObj = {};
                tObj["created_by_name"] = tweet["fName"];
                tObj["created_by_username"] = tweet["fUsername"];
                tObj["tweet_id"] = fTweets[ft]["id"];
                tObj["tweet_content"] = fTweets[ft]["text"];
                tObj["created_at"] = fTweets[ft]["created_at"];
                tObj["avatar_color"] = avatarColor;

                finalTweets.push(tObj);
            }
        }
        return finalTweets;
    }

    function generateAvatarColor(string) {
        let hash = 0, i = 0;

        for (i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.substr(-2);
        }
        return color;
    }

    async function handleSaveUser() {
        setEditModeOn(prevMode => !prevMode);
        let changedUser = editUserChange.trim();
        setHeadUser({
            "username": changedUser,
            "userlink": `https://twitter.com/${changedUser}`
        });

        if (changedUser === headUser.username) {
            setEditModeOn(prevMode => !prevMode);
            return;
        }
        await updateHeadUser(changedUser);
        setDataLoaded(false);
        await getTweets(changedUser);
    }

    function handleMultiSelect(e) {
        const {
            target: { value },
        } = e;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div className="content-div">
            <div className="content-header">
                <div style={{ display: "flex" }}>
                    <h6>
                        Showing results for:
                    </h6>
                </div>

                <div className="change-user-div">
                    <h6>
                        {editModeOn ?
                            (
                                <>
                                    <Input onChange={(e) => setEditUserChange(e.target.value)} sx={{ p: 0, ml: "0.25rem", mt: "-3rem", width: (0.5 + editUserChange.length / 2) + "rem" }} defaultValue={editUserChange} />
                                    <Tooltip title="Save">
                                        <IconButton onClick={handleSaveUser} color="success" size="0.25rem"
                                            sx={{ padding: 0, ml: 1 }}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel">
                                        <IconButton onClick={() => { setEditUserChange(headUser.username); setEditModeOn(prevMode => !prevMode); }} color="error" size="0.25rem"
                                            sx={{ padding: 0, ml: 1 }}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Tooltip>
                                </>

                            )
                            :
                            (
                                <>
                                    <a href={headUser.userlink} target="_blank" rel="noreferrer">
                                        {headUser.username}
                                    </a>
                                    <Tooltip title="Change">
                                        <IconButton onClick={() => setEditModeOn(prevMode => !prevMode)} color="primary" size="0.25rem"
                                            sx={{ padding: 0, ml: 1 }}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )

                        }

                    </h6>
                </div>
            </div>
            {/*
            <div className="collection-header">
                <div className="collection-select">
                    <FormControl sx={{
                        ml: "30%", width: "100%", '@media (max-width: 800px)': {
                            ml: "2%",
                            width: '98%'
                        }
                    }}>
                        <InputLabel id="select-label">Collections</InputLabel>
                        <Select
                            labelId="select-label"
                            id="collections-select"
                            multiple
                            displayEmpty
                            value={personName}
                            onChange={handleMultiSelect}
                            input={<OutlinedInput label="Collections" />}
                            renderValue={(selected) => selected.join(', ')}
                            sx={{
                                width: "70%", '@media (max-width: 800px)': {
                                    width: '100%'
                                }
                            }}
                        >
                            {names.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={personName.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                
                <div className="collection-btns">
                    <div className="expand">
                        <Tooltip title="Create new collection">
                            <Button onClick={() => setCreateCollectionState(true)} sx={{ m: 1, borderRadius: "50px" }} variant="outlined" startIcon={<PlaylistAddRoundedIcon />}>
                                Create
                            </Button>
                        </Tooltip>
                        <Tooltip title="My collections">
                            <Button onClick={() => setViewCollectionState(true)} sx={{ m: 1, borderRadius: "50px" }} variant="outlined" startIcon={<ListAltRoundedIcon />}>
                                View
                            </Button>
                        </Tooltip>
                    </div>
                    <div className="collapse">
                        <Tooltip title="Create new collection">
                            <IconButton onClick={() => setCreateCollectionState(true)} color="info" aria-label="add a collection" size="large">
                                <PlaylistAddRoundedIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="My collections">
                            <IconButton onClick={() => setViewCollectionState(true)} color="info" aria-label="my collections" size="large">
                                <ListAltRoundedIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
             
            </div>
            */}
            {
                dataLoaded ? (<div className="tweets-div">
                    {(tweets && tweets.length > 0) &&
                        tweets.map((tweet) => (
                            <TweetCard key={tweet.tweet_id} value={tweet}></TweetCard>
                        ))
                    }
                </div>) : <Box sx={{ display: 'flex', margin: "auto", padding: "2rem" }}>
                    <CircularProgress />
                </Box>
            }
            <CreateCollection state={[createCollectionState, setCreateCollectionState, following, setFollowing]} />
            <ViewCollection state={[viewCollectionState, setViewCollectionState, myCollections, setMyCollections]} />
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                open={snackbarState.open}
                autoHideDuration={2000}
                onClose={() =>
                    setSnackbarState({
                        open: false,
                        message: ""
                    })
                }
                message={snackbarState.message}
            />
        </div >
    );
}

export default Dashboard;