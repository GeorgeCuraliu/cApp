import "../styles/chatPage/serverChat.css"
import MessageContainer from "./messageContainer";
import { Context } from "../context/context";
import { useContext, useEffect, useRef } from "react";


const ServerMessageContainer = (props) => {

    const {code} = useContext(Context);

    const messageContainer = useRef()

    const scrollDown = () => {//is used to automaticaly scroll down when the chat messages are loaded
        console.log("scrolling down");
        messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
    };

    const isScrolledToTop = () => {//checks if the top of container is touched
        return messageContainer.current.scrollTop === 0;
    };

    const handleScroll = () => {
        if(isScrolledToTop()){
            props.requestMessages();
        }
    }

    useEffect(() => {
        console.log(props.messages)
        scrollDown();
        messageContainer.current.addEventListener(`scroll`, handleScroll);
        return(
            messageContainer.current.removeEventListener(`scroll`, handleScroll)
        )
    }, [props.messagesLoaded])

    return(
        <div ref={messageContainer} className="serverMessageContainer">
            {props.messages && Object.values(props.messages).map(val => {
               return <MessageContainer message={val[0]} sentByThisUser={code === val[1]}/>
            })}
            
        </div>
    )

}

export default ServerMessageContainer;