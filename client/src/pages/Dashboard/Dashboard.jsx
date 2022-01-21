import { useState, useEffect, useContext } from "react";
import axios from "axios";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import './Dashboard.css';
import { Button, IconButton, Tooltip } from "@mui/material";
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';

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

    function handleMultiSelect(e) {
        const {
            target: { value },
        } = e;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


    const [data, setData] = useState([]);

    useEffect(() => {
        async function getTweets() {
            const url = 'http://localhost:8080/getTweets';

            axios.get(url, { withCredentials: true })
                .then(function (response) {
                    setData(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        getTweets();
    }, []);
    return (
        <div className="content-div">
            <div className="collection-header">
                <div className="collection-select">
                    <FormControl sx={{
                        ml: "30%", width: "100%", '@media (max-width: 800px)': {
                            ml: "2%",
                            width: '98%'
                        }
                    }}>
                        <InputLabel id="select-label">Select</InputLabel>
                        <Select
                            labelId="select-label"
                            id="collections-select"
                            multiple
                            displayEmpty
                            value={personName}
                            onChange={handleMultiSelect}
                            input={<OutlinedInput label="Select" />}
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
                            <Button sx={{ m: 1 }} variant="contained" startIcon={<PlaylistAddRoundedIcon />}>
                                Create
                            </Button>
                        </Tooltip>

                        <Tooltip title="My collections">
                            <Button sx={{ m: 1 }} variant="contained" startIcon={<ListAltRoundedIcon />}>
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
            <div className="tweets-div">
                {data.length > 0 &&
                    data.map((item) => (<li key={item.id}>{item.text}</li>))
                }
            </div>
        </div>
    );
}

export default Dashboard;