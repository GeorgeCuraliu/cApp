import React, { useContext } from "react";
import axios from "axios";
import { Context } from "../context/context";

const ReceivedRequestCard = (props) => {

    let {name, code} = useContext(Context);

    const accept = () => {
        console.log(`sending request response --- true  from ${name} ${code}  to  ${props.user} ${props.code}`)
        axios.post("http://localhost:3009/requestReponse", {sender : [name, code], receiver: [props.user, props.code], response: true})//will retrieve a object with friend request for this account
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }

    const refuse = () => {
        console.log(`sennding request response --- true from ${name} ${code}  to  ${props.user} ${props.code}`);
        axios.post("http://localhost:3009/requestReponse", {sender : [name, code], receiver: [props.user, props.code], response: false})//will retrieve a object with friend request for this account
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }

    return (
        <div className="receivedRequestCard">
            <div className="userInfo">
                <div className="userImage">

                </div>
                <p>
                    {props.user}
                </p>
            </div>
            <div className="responseContainer">
                <div className="response accept" onClick={accept}>
                    
                </div>
                <div className="response decline" onClick={refuse}>
                    
                </div>
            </div>
        </div>
    )
}

export default ReceivedRequestCard;