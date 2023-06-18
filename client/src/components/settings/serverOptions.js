import React from "react";
import "../styles/settings/serverOptions.css"
import { useState } from "react";
import axios from "axios";
import { Context } from "../context/context";
import { useContext } from "react";
import ServerContainer from "./serversContainer";

const ServerOptions = () => {

    const {name, code} = useContext(Context)

    const [createServerName, setCreateServerName] = useState("");
    const [createServerDescription, setCreateServerDescription] = useState("");

    const handleCreateServerName = (e) => {
        setCreateServerName(e.target.value);
    }

    const handleCreateServerDescription = (e) => {
        setCreateServerDescription(e.target.value);
    }

    const createServer = () => {
        console.log(createServerDescription);
        console.log(createServerName)
        axios.post("http://localhost:3009/createServer", {serverName: createServerName, description: createServerDescription, owner: [name, code]})
            .then((response) => {
                console.log(response);
            })
    }


    return(
        <div className="serverOptions">
            <header className="serverOptionsHeader">
                <p>Create a server</p>
                <div className="createServerOptions">
                    <div className="inputDataContainer">
                        <input 
                            placeholder="Server name"
                            value={createServerName}
                            onChange={handleCreateServerName}/>
                        <input 
                            placeholder="Server description -- optional"
                            value={createServerDescription}
                            onChange={handleCreateServerDescription}/>
                    </div>
                    <div className="optionContainer">
                        {/* {some other options like users/admins/create channels or add users per channel} */}
                    </div>
                </div>
                <button onClick={createServer} className="confirmNewServer">Create</button>
            </header>
            <ServerContainer />
        </div>
    )
}

export default ServerOptions;