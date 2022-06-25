import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/includes/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Profile from "./components/screens/Profile";
import Register from "./components/screens/Register";
import AuthProvider from "./context/auth";
import Nothing from "./nothing";


function App() {
    return (
        <AuthProvider>
            <Router>
                {/* <Navbar /> */}
                <Routes>
                    <Route exact path="/" element={<PrivateRoute />} >
                        <Route exact path="/" element={<Home />} />
                    </Route>
                    <Route exact path="/user-profile" element={<PrivateRoute />} >
                        <Route exact path="/user-profile" element={<Profile />} />
                    </Route>
                    <Route exact path="/login/" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
