import React from "react";
import "../styles/chatContainer.css"

const MessageContainer = React.forwardRef((props, ref) => {

    let messageContainerStyle;
    let pStyle;
    let cutDivStyle;

    if(props.sentByThisUser){//will decide what style should have the message(dependinf if it was sent by this user or not)

        messageContainerStyle = {
            alignSelf: "flex-end",
            flexDirection: "row-reverse"
        }

        pStyle = {marginRight: "23px"}
        cutDivStyle = {right: "0"}

    }else{

        pStyle = {marginLeft: "23px"}
        cutDivStyle = {left: "0"}

    }
    
    return(
        <div ref={ref} className="messageContainer" style={messageContainerStyle}>
            <img className="messageReaction" alt="messageReaction"/>
            <div className="cutDiv" style={cutDivStyle}></div>
            <p style={pStyle}>{props.message}</p>
        </div>
    )
})

export default MessageContainer