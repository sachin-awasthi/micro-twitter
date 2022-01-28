import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import SignupForm from "../components/SignupForm/SignupForm"
import "./Signup.css";

function Signup() {
    let navigate = useNavigate();

    return (
        <div className="signup-div">
            {/* <h3 className="signup-heading">Sign up</h3> */}
            <SignupForm />
            <footer>
                Already registered?
                <Button onClick={() => navigate("/login")}>
                    Login
                </Button>
            </footer>
        </div>
    )
}

export default Signup;