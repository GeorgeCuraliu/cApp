import { useContext } from "react";
import { Context } from "../context/context";


const ServerCard = (props) => {

    let {setServerChatOpen, setUserChatOpen, userChatOpen} = useContext(Context)

    const handleServerClick = () => {
        console.log(`server chat triggered for the server ${props.code}`)
        setServerChatOpen(true);
        if(userChatOpen){setUserChatOpen(false)}//in case that the use chat is open, it tursn it off
    }

    return(
        <div className="serverCard" onClick={handleServerClick}>
            <div className="serverImage"></div>
            <p className="serverName">{props.name}</p>
        </div>
    )

}

export default ServerCard;