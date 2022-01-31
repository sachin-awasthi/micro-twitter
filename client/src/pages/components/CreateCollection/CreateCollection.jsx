import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import ClearIcon from '@mui/icons-material/Clear';
import "./CreateCollection.css";
import axios from "axios";

function CreateCollection(props) {
    const [createCollectionState, setCreateCollectionState, following, setFollowing] = props.state;
    const [followingCopy, setFollowingCopy] = useState([]);
    const [pageTwo, setPageTwo] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [collectionName, setCollectionName] = useState("");
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: ""
    });

    function changeUserMode(userId, mode) {
        if (followingCopy.length === 0) {
            setFollowingCopy(following);
        }
        let fClone = JSON.parse(JSON.stringify(following));

        fClone.map((item) => {
            if (item.followingUserId === userId) item.removeMode = mode;
        });

        setFollowing(fClone);

        fClone = JSON.parse(JSON.stringify(followingCopy));

        fClone.map((item) => {
            if (item.followingUserId === userId) item.removeMode = mode;
        });

        setFollowingCopy(fClone);
    }

    function handleLiveSearch(e) {
        let sQuery = e.target.value;
        sQuery = sQuery.toLowerCase();

        if (followingCopy.length === 0) {
            setFollowingCopy(following);
        }
        let fClone = JSON.parse(JSON.stringify(followingCopy));

        fClone = fClone.filter((item) =>
            item.followingName.toLowerCase().includes(sQuery) || item.followingUsername.toLowerCase().includes(sQuery)
        );

        setFollowing(fClone);
    }

    function handleBackAction() {
        setPageTwo(false);
    }

    function handleNextAction() {
        let selectedUsersId = [];
        for (let i = 0; i < following.length; i++) {
            if (following[i].removeMode) {
                selectedUsersId.push(following[i].followingUserId);
            }
        }
        if (selectedUsersId.length > 0) {
            setSelectedUsers(selectedUsersId);
            setPageTwo(true);
        } else {
            setSnackbarState({
                open: true,
                message: "Select atleast one user"
            });
        }
    }

    function handleSaveCollection() {
        const url = 'https://micro-twitter-server.herokuapp.com/createCollection';
        let data = {
            collection: collectionName,
            usersSelected: selectedUsers
        }
        //withCredentials allow storing cookie in browser
        axios.post(url, data, { withCredentials: true })
            .then(function (response) {
                setSnackbarState({
                    open: true,
                    message: response.data
                });
                if (response.data === "Collection created") {
                    setTimeout(() => {
                        setSnackbarState({
                            open: false,
                            message: ""
                        });
                        closeDialog()
                    }, 500);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function closeDialog() {
        setCreateCollectionState(false);
        setCollectionName("");
        let fClone = JSON.parse(JSON.stringify(following));

        fClone.map((item) => {
            item.removeMode = false;
        });
        setTimeout(() => {
            setFollowing(fClone);
            setPageTwo(false);
        }, 2000);
    }

    return (
        <>
            <Dialog fullWidth open={createCollectionState} onClose={closeDialog}>
                <DialogTitle sx={{ textAlign: "center" }}>New Collection</DialogTitle>
                {
                    !pageTwo ?
                        (
                            <>
                                <DialogContent>
                                    <TextField sx={{ mt: 0.25, mb: 1 }} onChange={handleLiveSearch} placeholder="Search" size="small" fullWidth id="fullWidth" />
                                    <div className="collection-div">
                                        {following.map((user) => (
                                            <div className="following-div" key={user.followingUserId}>
                                                <div className="following-avatar">
                                                    <Avatar component={Paper} elevation={1} sx={{
                                                        bgcolor: user.avatar_color, fontSize: "1rem",
                                                        width: 40, height: 40, margin: "auto", '@media (max-width: 800px)': {
                                                            fontSize: "0.8rem", width: 30, height: 30
                                                        }
                                                    }} >{user.followingName[0]}</Avatar>
                                                </div>
                                                <div className="following-info">
                                                    <span className="following-name">{user.followingName}</span>
                                                    <span className="following-username">@{user.followingUsername}</span>
                                                </div>
                                                <div className="follow-btn">
                                                    {
                                                        user.removeMode ? (
                                                            <IconButton onClick={() => changeUserMode(user.followingUserId, false)} color="error" aria-label="remove user" size="medium">
                                                                <ClearIcon fontSize="medium" />
                                                            </IconButton>
                                                        ) :
                                                            (
                                                                <IconButton onClick={() => changeUserMode(user.followingUserId, true)} color="info" aria-label="add user" size="medium">
                                                                    <PersonAddAltRoundedIcon fontSize="medium" />
                                                                </IconButton>
                                                            )
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button color="info" onClick={handleNextAction}>NEXT</Button>
                                    <Button color="error" onClick={closeDialog}>CANCEL</Button>
                                </DialogActions>
                            </>
                        ) :
                        (
                            <>
                                <DialogContent>
                                    <p>{selectedUsers.length} users selected</p>
                                    <TextField sx={{ mt: 0.25, mb: 1 }} value={collectionName} onChange={(e) => setCollectionName(e.target.value)} placeholder="Collection name" size="small" fullWidth id="fullWidth" />
                                </DialogContent>
                                <DialogActions>
                                    <Button color="info" onClick={handleBackAction}>BACK</Button>
                                    <Button color="success" onClick={handleSaveCollection}>SAVE</Button>
                                    <Button color="error" onClick={closeDialog}>CANCEL</Button>
                                </DialogActions>
                            </>
                        )
                }
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
            </Dialog>
        </>
    );
}

export default CreateCollection;
