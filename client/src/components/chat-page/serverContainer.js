import React, { useEffect, useState } from "react";
import "../styles/serverContainer.css";
import axios from "axios";
import { useContext } from "react";
import { Context } from "../context/context";
import ServerCard from "./serverCard";

const ServerContainer = () => {

    const {name, code} = useContext(Context)
    const [servers, setServers] =useState();

    useEffect(() => {
        console.log("getting servers info")
        if(code && name){
            axios.post("http://localhost:3009/getServers", {user: [name, code]})
            .then(response => {
                console.log(response.data);
                setServers(response.data);
            })
        }

    }, [code, name])


    return(
        <div className="serverContainer">
            <div className="triggerUserContainerContainer">
                <div className="triggerUserContainer"></div>
                <p>Friends</p>
            </div>
            {servers && Object.keys(servers).map(server => {
                    return( <ServerCard name={servers[server]} code={server}/>)
                })}
        </div>
    )
}

export default ServerContainer;