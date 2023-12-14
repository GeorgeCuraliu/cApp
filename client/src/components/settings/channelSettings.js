import { useState } from "react";
import axios from "axios";

const ChannelSettings = (props) => {

    const [activeCardOptions, setActiveCardOptions] = useState() // will trigger the options for a user card on hover and close them on mouse leave

    const handleUserOptions = (key) => {
        setActiveCardOptions(key);
    }

    const handleUserAccesibility = (code, name) => {
        axios.post("http://localhost:3009/changeUserAccesiblityChannel", {serverCode : props.activeServer, channel: props.activeChannel.channelName, user: [code, name]})
            .then(response => {
                console.log(response)
                if(response.status === 200){props.changeUserChannelAccesibility(code, name)}
            })
    }   

    const handleUserMessageAccesibility = (code, name) => {
        axios.post("http://localhost:3009/changeUserMessageAcces", {serverCode : props.activeServer, channel: props.activeChannel.channelName, user: [code, name]})
            .then(response => {
                console.log(response)
                if(response.status === 200){props.chnageUserMessageAccesibility(code, name)}
            })
    }

    return(
        <div className="channelOptions">
            <div className="channelOptionHeader">
                <p className="channelName">{props.activeChannel.channelName}</p>
                    {props.mainChannel !== props.activeChannel.channelName && <button onClick={props.changeMainChannel}>Set this channel as main channel</button>}
                    <div className="channelPrivacyOptions">
                        <div>
                            <input
                                type="checkbox"
                                checked={props.activeChannel.acces === "private"}
                                onChange={() => {props.changeChannelPrivacySettings("acces")}}/>
                            <p>Private</p>
                        </div>
                        <div>
                            <input 
                                type={"checkbox"}
                                checked={props.activeChannel.messageAcces === "public"}
                                onChange={() => {props.changeChannelPrivacySettings("messageAcces")}}/>
                            <p>Anyone can send messages</p>
                        </div>
                    </div>
                </div>
                <p>Users that have acces to the channel</p>
                <div className="serverUsers">
                    {props.users && Object.entries(props.users).map(([key, value]) => {

                        let acces;//red if the user does not have acces to server, green if he has
                        props.activeChannel.acces === "public" ? acces = "green" : props.activeChannel.users[key] ? acces = "green" : acces = "red";

                        return(
                            <div 
                                className="userCard" 
                                style={{backgroundColor: acces}} 
                                key={key}
                                onMouseEnter={() => {handleUserOptions(key)}}
                                onMouseLeave={() => {handleUserOptions(false)}}>
                                <div className="cardImg"></div>
                                <div className="cardName">{value}</div>
                                {activeCardOptions === key && 
                                    <div className="cardOptions">
                                        {props.activeChannel.acces === "private" && <div className="setAccesibility" onClick={() => {handleUserAccesibility(key, value)}}>{acces === "green" ? "Remove acces" : "Add to channel"}</div>}
                                        {props.activeChannel.messageAcces === "private" && <div onClick={() => {handleUserMessageAccesibility(key, value)}} className="setAccesibility">{props.activeChannel.usersMessageAcces[key] ? "Remove write acces" : "Add write acces"}</div>}
                                    </div>}
                            </div>
                        )
                    })}
                </div>   
            </div>
    )
}

export default ChannelSettings;