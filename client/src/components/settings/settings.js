import React from "react";
import "../styles/settings/settings.css"
import { useState } from "react";
import ServerOptions from "./serverOptions";
import JoinServer from "./joinServer";
import CreateServer from "./createServer";

const Settings = () => {

    const [activeSettings, setActiveSettings] = useState()
    const [joinServerPage, setJoinServerPage] = useState(false)//will decide if the page for joining a server is displayed or not
    const [createServerPage, setCreateServerPage] = useState(false)


    const closeJoinServer = () => { setJoinServerPage(false) }
    const closeCreateServer = () => { setCreateServerPage(false)}

    return(
    <div className="container">
        {joinServerPage && <JoinServer close={closeJoinServer}/>}{/**This componenet will be absolute components that will display on top of everything and have blur backgriund(without closing active settings) */}
        {createServerPage && <CreateServer close={closeCreateServer}/>}

        <div className="categorys">
            <section onClick={() => {setActiveSettings("serverOptions")}}>Servers options</section>
            <section onClick={() => {setJoinServerPage(true)}}>Join a server</section>
            <section onClick={() => {setCreateServerPage(true)}}>Create a server</section>
        </div>
        {activeSettings === "serverOptions" && <ServerOptions />}
    </div>)
}

export default Settings;