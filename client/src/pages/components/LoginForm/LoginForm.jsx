import { useState, useContext } from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import { AuthenticateContext } from '../../../App';

const regex = /^[0-9a-zA-Z_]+$/i;

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameState, setUsernameState] = useState({ error: false, helper: "" });
    const [passwordState, setPasswordState] = useState({ error: false, helper: "" });

    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: ""
    });

    const { setAuth } = useContext(AuthenticateContext);

    function handleLogin(e) {
        if (!validateInputs()) {
            e.preventDefault();
            return;
        }
        const url = 'https://micro-twitter-server.herokuapp.com/login';
        const data = {
            username: username,
            password: password
        }

        //withCredentials allow storing cookie in browser
        axios.post(url, data, { withCredentials: true })
            .then(function (response) {
                const msg = response.data.msg;
                const token = response.data.token;
                const headUser = response.data.headUser;
                if (msg === "Logged in") {
                    setAuth(true);
                    localStorage.setItem("jwt-token", token);
                    localStorage.setItem("username", username);
                    localStorage.setItem("headUser", headUser);
                } else {
                    setSnackbarState({
                        open: true,
                        message: msg
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        e.preventDefault();
    }

    function validateInputs() {
        let isValid = false;

        if (!username && !password) {
            setUsernameState({
                error: true,
                helper: "Username cannot be blank"
            });
            setPasswordState({
                error: true,
                helper: "Password cannot be blank"
            });
        } else if (!username) {
            setUsernameState({
                error: true,
                helper: "Username cannot be blank"
            });
        } else if (!password) {
            setPasswordState({
                error: true,
                helper: "Password cannot be blank"
            });
        } else if (!regex.test(username)) {
            setUsernameState({
                error: true,
                helper: "Invalid username"
            });
        } else {
            isValid = true;
        }
        return isValid;
    }


    function handleInputChange(e) {
        const inputId = e.target.id;
        const inputValue = e.target.value;

        switch (inputId) {
            case "username-input":
                setUsername(inputValue);
                if (inputValue && !regex.test(inputValue)) {
                    setUsernameState({
                        error: true,
                        helper: "Invalid username"
                    });
                } else {
                    setUsernameState({
                        error: false,
                        helper: ""
                    });
                }
                break;

            case "password-input":
                setPassword(inputValue);
                setPasswordState({
                    error: false,
                    helper: ""
                });
                break;

            default:
                break;
        }
    }

    return (
        <>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <TextField className="form-input"
                        id="username-input"
                        required
                        autoFocus={true}
                        label="Username"
                        value={username}
                        onChange={handleInputChange}
                        error={usernameState.error}
                        helperText={usernameState.helper}
                        InputLabelProps={{
                            shrink: true
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <div className="form-group">
                    <TextField className="form-input"
                        id="password-input"
                        required
                        label="Password"
                        type="password"
                        value={password}
                        onChange={handleInputChange}
                        error={passwordState.error}
                        helperText={passwordState.helper}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <Button type="submit" onClick={handleLogin} variant="outlined" color="success"
                    startIcon={<LoginIcon />}>
                    LOGIN
                </Button>
            </form>
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
        </>
    )
}

export default LoginForm;