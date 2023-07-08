import { useContext } from "react";
import { Context } from "../context/context";


const ServerCard = (props) => {

    let {setServerChatOpen, setUserChatOpen, userChatOpen, setActiveServerChatData} = useContext(Context)

    const handleServerClick = () => {
        console.log(`server chat triggered for the server ${props.code}`);
        if(userChatOpen){setUserChatOpen(false)}//in case that the use chat is open, it turns it off
        setServerChatOpen(true);
        setActiveServerChatData({name : props.name, code: props.code})
    }

    return(
        <div className="serverCard" onClick={handleServerClick}>
            <div className="serverImage"></div>
            <p className="serverName">{props.name}</p>
        </div>
    )

}

export default ServerCard;