import { Link } from "react-router-dom";
import "./Homepage.css";

function HomePage() {
    return (
        <>
            <Link to="/signup"><button>Signup</button></Link>
            <Link to="/login"><button>Login</button></Link>
        </>
    )
}

export default HomePage;