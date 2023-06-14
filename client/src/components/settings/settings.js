import React from "react";
import "../styles/settings/settings.css"
import { useState } from "react";
import ServerOptions from "./serverOptions";

const Settings = () => {

    let [activeSettings, setActiveSettings] = useState()

    const loadServerOptions = () => {
        setActiveSettings("serverOptions")
    }

    return(
    <div className="container">
        <div className="categorys">
            <section onClick={loadServerOptions}>Servers options</section>
        </div>
        {activeSettings === "serverOptions" && <ServerOptions />}
    </div>)
}

export default Settings;