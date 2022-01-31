import { useState, useContext } from "react";
import axios from "axios";
import { AuthenticateContext } from '../../../App';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import "./Header.css";

function Header() {
    const { isAuth, setAuth } = useContext(AuthenticateContext);
    const [anchorElNav, setAnchorElNav] = useState(null);

    const username = localStorage.getItem("username");

    function handleChangePassword() {
        setAnchorElNav(null);
        alert("Wait");
    }

    async function handleLogout() {
        setAnchorElNav(null);
        const url = 'https://micro-twitter-server.herokuapp.com/logout';

        await axios.get(url, { withCredentials: true })
            .then(function (response) {
                const msg = response.data.msg;
                if (msg === "Logged out") {
                    setAuth(false);
                } else {
                    console.log(msg);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <>
            <AppBar style={{ backgroundColor: "#292826" }}>
                <Container>
                    <Toolbar>
                        <Tooltip title="Powered by Twitter">
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                className="nav-brand"
                            >
                                <Link href="https://twitter.com" target="_blank" underline="none" color="inherit">
                                    MicroTwitter
                                </Link>
                            </Typography>
                        </Tooltip>

                        {
                            isAuth &&
                            (
                                <Box sx={{ flexGrow: 0, position: "absolute", right: 0 }}>
                                    <Tooltip title="Settings">
                                        <IconButton onClick={(e) => setAnchorElNav(e.currentTarget)}>
                                            <Avatar alt="User" src="avatar.jpeg" />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorElNav}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElNav)}
                                        onClose={() => setAnchorElNav(null)}
                                    >
                                        <div style={{ padding: "0.5rem" }} className="username-div">
                                            <PersonOutlineTwoToneIcon sx={{ marginLeft: "5px" }} />
                                            <Typography sx={{ marginLeft: "5px", fontWeight: "bold" }}>
                                                {username}</Typography>
                                        </div>
                                        <hr />
                                        {/* <MenuItem onClick={handleChangePassword}>Change Password</MenuItem> */}
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </Box>
                            )
                        }
                    </Toolbar>
                </Container>
            </AppBar>
            <Toolbar />
        </>
    )
}

export default Header;