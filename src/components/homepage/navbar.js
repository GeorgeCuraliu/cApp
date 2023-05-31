import React from "react";
import "../styles/navbar.css"
import { Link } from "react-router-dom";
const Navbar = () => {


    return(
        <header>
            <div className="log-in">
                <Link className="link" to="/authentication/logIn">Log in</Link>
            </div>
            <div className="create-account">
                <Link className="link" to="/authentication/createAccount">Create account</Link>
            </div>
            <p className="app-name">MrBlec` chatApp</p>
        </header>
    )
}
export default Navbar;