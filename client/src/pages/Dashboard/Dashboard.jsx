import { useState, useEffect, useContext } from "react";
import axios from "axios";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import { Button, IconButton, Tooltip } from "@mui/material";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import './Dashboard.css';
import TweetCard from '../components/TweetCard/TweetCard';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        },
    },
};
const names = [
    "Business",
    "Sports"
];


function Dashboard() {
    const [personName, setPersonName] = useState([]);
    const [tweets, setTweets] = useState("");
    const [headUser, setHeadUser] = useState({});
    const [editUserChange, setEditUserChange] = useState("");
    const [dataLoaded, setDataLoaded] = useState(null);
    const [editModeOn, setEditModeOn] = useState(null);

    //tweet will contain -> tweet_id, tweet_text, created_at, created_by
    useEffect(async () => {
        let finalTweets = "";
        async function getTweets() {
            const url = 'http://localhost:8080/getTweets';

            await axios.get(url, { withCredentials: true })
                .then(function (response) {
                    setHeadUser({
                        "username": response.data.username,
                        "userlink": `https://twitter.com/${response.data.username}`
                    });
                    setEditUserChange(response.data.username);
                    finalTweets = processTweetsData(response.data.allTweets);
                    finalTweets.sort((a, b) => a["created_at"] >= b["created_at"] ? -1 : 1)
                    setDataLoaded(true);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        await getTweets();
        setTweets(finalTweets);
    }, []);

    function processTweetsData(tData) {
        const finalTweets = [];
        for (let t = 0; t < tData.length; t++) {
            let tweet = tData[t];
            let fTweets = tweet["fTweets"];
            let avatarColor = generateAvatarColor(tweet["fUsername"], 100, 100);
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

    function handleSaveUser() {
        setHeadUser({
            "username": editUserChange,
            "userlink": `https://twitter.com/${editUserChange}`
        }
        );
        setEditModeOn(prevMode => !prevMode);
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
                                    <a href={headUser.userlink} target="_blank">
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
                            <Button sx={{ m: 1, borderRadius: "50px" }} variant="contained" startIcon={<PlaylistAddRoundedIcon />}>
                                Create
                            </Button>
                        </Tooltip>

                        <Tooltip title="My collections">
                            <Button sx={{ m: 1, borderRadius: "50px" }} variant="contained" startIcon={<ListAltRoundedIcon />}>
                                List
                            </Button>
                        </Tooltip>

                    </div>
                    <div className="collapse">
                        <Tooltip title="Create new collection">
                            <IconButton color="info" aria-label="add a collection" size="large">
                                <PlaylistAddRoundedIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="My collections">
                            <IconButton color="info" aria-label="my collections" size="large">
                                <ListAltRoundedIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </div>

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
        </div >
    );
}

export default Dashboard;