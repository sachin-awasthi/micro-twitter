import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthenticateContext } from '../../../App';

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { setAuth } = useContext(AuthenticateContext);

    function handleLogin(e) {
        const url = 'http://localhost:8080/login';
        const data = {
            username: username,
            password: password
        }

        //withCredentials allow storing cookie in browser
        axios.post(url, data, { withCredentials: true })
            .then(function (response) {
                const msg = response.data.msg;
                if (msg === "Logged in") {
                    setAuth(true);
                } else {
                    console.log(msg);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        e.preventDefault();
    }

    function handleInputChange(e) {
        const inputId = e.target.id;
        const inputValue = e.target.value;

        switch (inputId) {
            case "inputUsername":
                setUsername(inputValue);
                break;

            case "inputPassword":
                setPassword(inputValue);
                break;

            default:
                break;
        }
    }

    return (
        <>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Username</label>
                    <input type="name" value={username} onChange={handleInputChange} className="form-control" id="inputUsername" aria-describedby="emailHelp" placeholder="Enter username" />
                    <small id="emailHelp" className="form-text text-muted"></small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" value={password} onChange={handleInputChange} className="form-control" id="inputPassword" placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    )
}

export default LoginForm;