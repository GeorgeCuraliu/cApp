import "../styles/chatPage/serverChat.css"
import MessageContainer from "./messageContainer";
import { Context } from "../context/context";
import { useContext, useEffect, useRef } from "react";


const ServerMessageContainer = (props) => {

    const {code} = useContext(Context);

    const messageContainer = useRef()
    const messageRef = useRef()//used to refernce the last seen message before requesting more so the focus will be kept on this one
    const keepFocus = useRef()//will decide if the keepFocusF should be called

    const scrollDown = () => {//is used to automaticaly scroll down when the chat messages are loaded
        console.log("scrolling down");
        messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
    };

    const isScrolledToTop = () => {//checks if the top of container is touched
        console.log(messageContainer.current.scrollTop === 0)
        return messageContainer.current.scrollTop === 0;
    };

    const handleScroll = () => {
        if(isScrolledToTop()){
            if(!props.requestMessages()){
                keepFocus.current = true;
            }
        }
    }

    useEffect(() => {
        if (props.messagesLoaded) {scrollDown();}//needs to be triggered just once

        messageContainer.current.addEventListener(`scroll`, handleScroll);
        return () => {
            console.log(`messageContainer var ${messageContainer.current}`)
            if(!messageContainer.current){return}
            messageContainer.current.removeEventListener(`scroll`, handleScroll);
        };
    }, [props.messagesLoaded, messageContainer]);


    const keepFocusF = () => {
        console.log(`value of keepFocus ${keepFocus.current}`)
        if(keepFocus.current){
          console.log(`keeping focus -- value of message ref ${messageRef.current}`);
          messageRef.current.scrollIntoView({block: 'start'});
          keepFocus.current = false;//will redeclare it true just when fetching new messages
        }
      }

    return(
        <div ref={messageContainer} className="serverMessageContainer">
            {props.messages && Object.values(props.messages).map((val, index) => {
                const ref = index === 10 ? messageRef : null;
                const style = index === 0 ? {marginTop: "0px"} : null;
               return <MessageContainer style={style} ref={ref} message={val[0]} sentByThisUser={code === val[1]}/>
            })}
            {keepFocusF()}
        </div>
    )

}

export default ServerMessageContainer;