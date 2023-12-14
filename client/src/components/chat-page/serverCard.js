import { useContext } from "react";
import { Context } from "../context/context";


const ServerCard = (props) => {

    let {setServerChatOpen, serverChatOpen, activeServerChatData, setUserChatOpen, userChatOpen, setActiveServerChatData} = useContext(Context)

    const handleServerClick = () => {
        console.log(`server chat triggered for the server ${props.code}`);
        if(userChatOpen){setUserChatOpen(false)}//in case that the use chat is open, it turns it off
        setServerChatOpen(true);
        setActiveServerChatData({name : props.name, code: props.code})
    }

    let styleOBJ = {};
    if(serverChatOpen && activeServerChatData.name === props.name){
        styleOBJ = {backgroundColor: "#5C8374"};
    }

    return(
        <div style={styleOBJ} className="serverCard" onClick={handleServerClick}>
            <div className="serverImage"></div>
            <p className="serverName">{props.name}</p>
        </div>
    )

}

export default ServerCard;