import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import "./SignupForm.css";

const regex = /^[0-9a-zA-Z_]+$/i;

function SignupForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");

    const [usernameState, setUsernameState] = useState({ error: false, helper: "" });
    const [passwordState, setPasswordState] = useState({ error: false, helper: "" });
    const [repasswordState, setRepasswordState] = useState({ error: false, helper: "" });

    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: ""
    });

    const navigate = useNavigate();

    function handleSignup(e) {
        if (!validateInputs()) {
            e.preventDefault();
            return;
        }
        const url = 'http://localhost:8080/signup';
        const data = {
            username: username,
            password: password
        }

        //withCredentials allow storing cookie in browser
        axios.post(url, data, { withCredentials: true })
            .then(function (response) {
                if (response.data === "Username already exists!") {
                    setSnackbarState({
                        open: true,
                        message: "Username already exists"
                    });
                }
                else {
                    setSnackbarState({
                        open: true,
                        message: "User registered, Login now"
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

        if (!username && !password && !repassword) {
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
        } else if (password !== repassword) {
            setRepasswordState({
                error: true,
                helper: "Passwords don't match"
            });
        } else if (!regex.test(username)) {
            setUsernameState({
                error: true,
                helper: "Special characters not allowed"
            });
        } else {
            isValid = true;
        }
        return isValid;
    }

    function handleInputChange(e) {
        const inputId = e.target.id;
        let inputValue = e.target.value;

        switch (inputId) {
            case "username-input":
                setUsername(inputValue);

                if (inputValue && !regex.test(inputValue)) {
                    setUsernameState({
                        error: true,
                        helper: "Special characters not allowed"
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

            case "repassword-input":
                setRepassword(inputValue);
                if (inputValue !== password) {
                    setRepasswordState({
                        error: true,
                        helper: "Passwords don't match"
                    });
                } else {
                    setRepasswordState({
                        error: false,
                        helper: ""
                    });
                }
                break;

            default:
                break;
        }
    }

    return (
        <>
            <form onSubmit={handleSignup}>
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
                <div className="form-group">
                    <TextField className="form-input"
                        id="repassword-input"
                        required
                        label="Re-enter password"
                        type="password"
                        value={repassword}
                        onChange={handleInputChange}
                        error={repasswordState.error}
                        helperText={repasswordState.helper}
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
                <Button type="submit" onClick={handleSignup} variant="outlined" color="success"
                    startIcon={<ExitToAppIcon />}>
                    SIGN UP
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

export default SignupForm;