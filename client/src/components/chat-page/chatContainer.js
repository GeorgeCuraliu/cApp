import React, { useRef, useState, useEffect, useContext } from "react";
import "../styles/chatContainer.css";
import FriendChatHeader from "./friendsChatHeader";
import { Context } from "../context/context";
import axios from "axios";
import MessageContainer from "./messageContainer";
import { websocketContext } from "../context/webSocketContext";

const ChatContainer = () => {

  const { activeUserChatData, name, code } = useContext(Context);
  const { newUserMessage } = useContext(websocketContext);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  const messageContainerRef = useRef(null);
  const lastIndexRef = useRef();
  let keepFocus = useRef(false);//will decide if it necessaire to keep focus on an message after fetching another ones
  let messageRef = useRef();//used to keep focused on an element after the new requested elements  

  useEffect(() => {
    console.log(newUserMessage);
  }, [newUserMessage])

  const sendMessage = () => {
    console.log("sending message");
    if (activeUserChatData.name) {
      axios.post("http://localhost:3009/sendMessage", {
          sender: [name, code],
          receiver: [activeUserChatData.name, activeUserChatData.code],
          message: { message: message },
          chatNumber: activeUserChatData.chatCode,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  console.log(messages);
  console.log(`${lastIndexRef.current} -> [${lastIndexRef.current - 9}, ${lastIndexRef.current}] -- the future messages request index`);

  const handleScroll = () => {//will always check if it needs to request more messages(if the scoll reach the top of container)
    if (isScrolledToTop()) {
      console.log(`Requesting new messages ${lastIndexRef.current}`);
      axios.post("http://localhost:3009/getMessages", {
          chatCode: activeUserChatData.chatCode,
          index: lastIndexRef.current,
        })
        .then((response) => {

            if(typeof(response.data) === "string"){
                return console.log(response.data);
            }

            console.log(response.data);
            const lastIndex = response.data.lastIndex;
            lastIndexRef.current = lastIndex;
            for (let i = 0; i < response.data.messages.length; i++) {
                setMessages((prevMessages) => [
                response.data.messages[i],
                ...prevMessages,
                ]);
            }
            console.log(messageRef)
            keepFocus.current = true
        });
    }
  };

  const isScrolledToTop = () => {//checks if the top of container is touched
    const messageContainer = messageContainerRef.current;
    return messageContainer.scrollTop === 0;
  };

  const scrollDown = () => {//is used to automaticaly scroll down when the chat messages are loaded
    console.log("scrolling down");
    const messageContainer = messageContainerRef.current;
    messageContainer.scrollTop = messageContainer.scrollHeight;
  };

  useEffect(() => {//will request the first messages
    console.log("requesting messages")
    axios.post("http://localhost:3009/getMessages", {chatCode: activeUserChatData.chatCode,})
      .then((response) => {
        console.log(response.data.messages);
        const lastIndex = response.data.lastIndex;
        lastIndexRef.current = lastIndex;
        for (let i = 0; i < response.data.messages.length; i++) {
          setMessages((prevMessages) => [
            response.data.messages[i],
            ...prevMessages,
          ]);
        }
        setMessagesLoaded(true);
      })
      .catch((error) => {
        console.error(error);
      });

    const messageContainer = messageContainerRef.current;
    messageContainer.addEventListener("scroll", handleScroll);

    return () => {
        messageContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    console.log("use effect for scroll down triggered");
    if (messagesLoaded) {
      scrollDown();
    }
  }, [messagesLoaded]);

  const keepFocusF = () => {
    if(keepFocus.current){
      console.log("keeping focus")
      messageRef.current.scrollIntoView({block: 'start'});
      keepFocus.current = false;//will redeclare it true just when fetching new messages
    }
  }

  console.log(messageRef)

  return (
    <div className="chatContainer">
      <header>
        <FriendChatHeader />
      </header>
      <div className="messagesContainer" ref={messageContainerRef}>
        {messages && messages.map((element, index) => {
            const ref = index === 10 ? messageRef : null;
            const style = index === 0 ? {marginTop: "0px"} : null;
            if(element.by[0] === name){//will decide if the message was sent by this user or no, so will know how to display it
                return <MessageContainer ref={ref} style={style} key={index} message={element.message} sentByThisUser = {true}/>;
            }else{
                return <MessageContainer ref={ref} style={style} key={index} message={element.message} sentByThisUser = {false}/>;
            }
          })}
          {keepFocusF()}
      </div>
      <footer>
        <div>
          <input
            placeholder="Type your message here"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
          <div>Add image</div>
        </div>
      </footer>
    </div>
  );
};

export default ChatContainer;
