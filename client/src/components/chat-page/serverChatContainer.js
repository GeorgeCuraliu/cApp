import "../styles/chatPage/serverChatContainer.css";
import ServerHeader from "./serverHeader";
import { Context } from "../context/context";
import { useContext, useState, useEffect, useRef } from "react";
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
          console.log(response.data.returnInfo);
          let activeChannel = activeServerChatData.mainChannel ? activeServerChatData.activeChannel : response.data.returnInfo.mainChannel;//used to keep the activeChannel value as it is
          setActiveServerChatData(data => ({...data, ...response.data.returnInfo, activeChannel: activeChannel}));
        })
    }, [activeServerChatData.name]);

    console.log(`showServerOptions ${showServerOptions}`);

    return (
        <div className="serverChatBody" >
            <div className="serverChatContainer">
                <div style={{...triggerButtonStyle}} className="triggerServerInfo" onClick={() => {setShowServerOptions((val) => !val)}}></div>
                <ServerHeader name = {activeServerChatData.name} code={activeServerChatData.code}/>
                <ServerChat />
            </div>
            {showServerOptions && <ServerOptionsContainer />}
        </div>
    )
}

export default ServerChatContainer;