import React from "react";
import "../styles/settings/serverOptions.css"
import { useState } from "react";
import axios from "axios";
import { Context } from "../context/context";
import { useContext } from "react";
import ServerContainer from "./serversContainer";

const ServerOptions = () => {



    return(
        <div className="serverOptions">
            <ServerContainer />
        </div>
    )
}

export default ServerOptions;