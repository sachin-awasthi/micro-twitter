import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import auth from "./auth";
import Homepage from './pages/Homepage/Homepage';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import NoPage from './pages/NoPage/NoPage';
import Header from "./pages/components/Header/Header";
import './App.css';

const AuthenticateContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(async () => {
    const isAuth = await auth();
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <AuthenticateContext.Provider value={{ isAuth: isAuthenticated, setAuth: setIsAuthenticated }}>
        <div className="container">
          <div>
            <Header />
          </div>
          <div>
            <Routes>
              <Route exact path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Homepage />} />
              <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
              <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </div>
        </div>
      </AuthenticateContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { AuthenticateContext };