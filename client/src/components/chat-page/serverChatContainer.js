import "../styles/chatPage/serverChatContainer.css";
import ServerHeader from "./serverHeader";
import { Context } from "../context/context";
import { useContext, useState, useEffect } from "react";
import ServerOptionsContainer from "./serverOptionsContainer";
import axios from "axios";
import ServerChat from "./serverChatInput";

const ServerChatContainer = () => {

    const {activeServerChatData, setActiveServerChatData, code} = useContext(Context)

    const [showServerOptions, setShowServerOptions] = useState(false);

    let triggerButtonStyle = {};
    showServerOptions ? triggerButtonStyle= {right: "20vw"} : triggerButtonStyle ={};//will redeclare the width of the element so, it will not get outside

    useEffect(() => {//there i should request all the server data
        axios.post("http://localhost:3009/getServerData", {serverCode: activeServerChatData.code, userCode: code})
        .then((response) => {
          console.log(response);
          setActiveServerChatData({...activeServerChatData, ...response.data, activeChannel: response.data.mainChannel})
        })
    }, [activeServerChatData.name])

    return (
        <div className="serverChatBody" >
            <div className="serverChatContainer">
                <div style={{...triggerButtonStyle}} className="triggerServerInfo" onClick={() => {setShowServerOptions((val) => !val)}}></div>
                <ServerHeader name = {activeServerChatData.name} />
                <ServerChat />
            </div>
            {showServerOptions && <ServerOptionsContainer />}
        </div>
    )
}

export default ServerChatContainer;