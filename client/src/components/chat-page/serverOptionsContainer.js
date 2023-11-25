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
            Channels
            {activeServerChatData.channels && Object.keys(activeServerChatData.channels).map((key) => {
                return <p key={key} onClick={() => {changeMainChannel(key)}}>{key}</p>
            })}
            Users
             {activeServerChatData.users && Object.entries(activeServerChatData.users).map(([key, value]) => {
                return <p key={key}>{value}</p>
            })}
        </div>
    )
}

export default ServerOptionsContainer;