import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

function SignupForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");

    const navigate = useNavigate();

    function handleSignup(e) {
        const url = '/signup';
        const data = {
            username: username,
            password: password
        }

        //withCredentials allow storing cookie in browser
        axios.post(url, data, { withCredentials: true })
            .then(function (response) {
                navigate("/login");
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

            case "inputRepassword":
                setRepassword(inputValue);
                break;

            default:
                break;
        }
    }

    return (
        <>
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Username</label>
                    <input type="name" value={username} onChange={handleInputChange} className="form-control" id="inputUsername" aria-describedby="emailHelp" placeholder="Enter username" />
                    <small id="emailHelp" className="form-text text-muted"></small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" value={password} onChange={handleInputChange} className="form-control" id="inputPassword" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Re-enter Password</label>
                    <input type="password" value={repassword} onChange={handleInputChange} className="form-control" id="inputRepassword" placeholder="Re-enter Password" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    )
}

export default SignupForm;