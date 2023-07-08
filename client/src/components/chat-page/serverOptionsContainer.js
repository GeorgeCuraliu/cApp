import { useContext } from "react";
import { Context } from "../context/context";

const ServerOptionsContainer = () => {

    const {activeServerChatData, setActiveServerChatData} = useContext(Context)

    const changeMainChannel = (key) => {
        setActiveServerChatData((val) => ({ ...val, activeChannel: key }));
    }

    return(
        <div className="serverOptionsContainer">
            Channels
            {Object.keys(activeServerChatData.channels).map((key) => {
                return <p key={key} onClick={() => {changeMainChannel(key)}}>{key}</p>
            })}
            Users
            {Object.entries(activeServerChatData.users).map(([key, value]) => {
                return <p key={key}>{value}</p>
            })}
        </div>
    )
}

export default ServerOptionsContainer;