import "../styles/chatPage/serverChat.css"
import MessageContainer from "./messageContainer";
import { Context } from "../context/context";
import { useContext } from "react";


const ServerMessageContainer = (props) => {

    const {code} = useContext(Context);

    return(
        <div className="serverMessageContainer">
            {props.messages && Object.values(props.messages).map(val => {
               return <MessageContainer message={val[0]} sentByThisUser={code === val[1]}/>
            })}
        </div>
    )

}

export default ServerMessageContainer;