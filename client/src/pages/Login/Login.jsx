import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import LoginForm from "../components/LoginForm/LoginForm"
import "./Login.css";

function Login() {
    let navigate = useNavigate();

    return (
        <div className="login-div">
            <LoginForm />
            <footer>
                New user?
                <Button onClick={() => navigate("/signup")}>
                    Signup
                </Button>
            </footer>
        </div>
    )
}

export default Login;