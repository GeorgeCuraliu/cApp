import React from "react";
import UserContainer from "./user-container";
import { useState } from "react";
import FriendRequestPage from "./friend-request-page";
import { Context } from "../context/context";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ChatContainer from "./chatContainer";


const ChatPage = () => {    

    const navigate = useNavigate();
    let {setName, setCode, userChatOpen} = useContext(Context);
    let [friendPageDisplay, setFriendPageDisplay] = useState(false);//will handle the display of friend requests page

        useEffect(() => {
          const fetchData = async () => {
            if (document.cookie) {
              console.log(document.cookie + "  --cookie data found");
              let credentials = document.cookie.split("=")[1].split(" ");
              console.log(credentials[0] + " " + credentials[1] + "  credentials found");
              credentials[1] = credentials[1].replace(";", "");
      
              try {
                const response = await axios.post("http://localhost:3001/logIn", { userName: credentials[0], password: credentials[1] });
                console.log(`${response.data} validity of credentials`);
                if (response.data[0]) {
                  setName(credentials[0]);
                  setCode(response.data[1]);
                } else {
                  console.log("The cookie data is invalid");
                  navigate("/");
                }
              } catch (error) {
                console.error(error);
              }
            } else {
              navigate("/");
            }
          };
      
          fetchData();
        }, []);


    //create a a style object that will just set the flex-direction
    const styleContainer = {
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "100vh"
    }

    const handleFriendPage = () => {//this will cahnge the viibilit of friend page
        setFriendPageDisplay((value) => !value)
    }

    return(
        <div style={styleContainer}>
            <UserContainer  handleFriendPage = {handleFriendPage}/>
            {friendPageDisplay && <FriendRequestPage  handleFriendPage = {handleFriendPage}/>}
            {userChatOpen && <ChatContainer />}
        </div>
    )
}

export default ChatPage;