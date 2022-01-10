import { useContext } from "react";
import axios from "axios";
import { AuthenticateContext } from '../../../App';
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
    const { isAuth, setAuth } = useContext(AuthenticateContext);

    async function onPressLogout() {
        const url = '/logout';

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
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link to="/">
                    <h6 className="navbar-brand">MicroTwitter</h6>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <p>Hi Sachin!</p>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <p className="nav-link active" aria-current="page">Home</p>
                        </li>
                    </ul>
                </div>
                {isAuth ? <button onClick={onPressLogout}>Logout</button> : <></>}
            </div>
        </nav>
    )
}

export default Header;