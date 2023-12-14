import { useContext } from "react";
import { Context } from "../context/context";

const ServerOptionsContainer = () => {

    const {activeServerChatData, setActiveServerChatData} = useContext(Context)

    const changeMainChannel = (channel) => {
        console.log(`changing active channel to ${channel}`)
        // setActiveServerChatData((val) => ({ ...val, activeChannel : key }));
        setActiveServerChatData((val) => ({...val, activeChannel : channel}));
        console.log(activeServerChatData);
    };

    console.log(`loaded the options for server`)

    return(
        <div className="serverOptionsContainer">
            <div className="sectionTitle">Channels</div>
            {activeServerChatData.channels && Object.keys(activeServerChatData.channels).map((key) => {
                return <p className="settingCard" key={key} onClick={() => {changeMainChannel(key)}}>{key}</p>
            })}
            <div className="sectionTitle" style={{"paddingTop": "40px"}}>Users</div>
             {activeServerChatData.users && Object.entries(activeServerChatData.users).map(([key, value]) => {
                return <p className="settingCard" key={key}>{value}</p>
            })}
        </div>
    )
}

export default ServerOptionsContainer;