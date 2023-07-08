import axios from "axios";
import { useState, useEffect } from "react";


const GlobalSettings = (props) => {

    const [messageAccesNewChannel, setMessageAccesNewChannel] = useState("private");
    const [newChannelPrivacy, setNewChannelPrivacy] = useState("public");
    const [newChannelName, setNewChannelName] = useState("");
    const [globalSettings, setGlobalSettings] = useState();
    const [activeUserCardSettings, setActiveUserCardSettings] = useState()//will be used to trigger a small panel for a hovered user card that wil contain settings like block user


    useEffect(() => {//will get the global settings data

        axios.post("http://localhost:3009/getGlobalServerSettings", {serverCode: props.activeServer})
            .then(response => {
                console.log(response)
                setGlobalSettings(response.data);
            })

    }, [])


    const sendNewChannelData = () => {
        console.log(messageAccesNewChannel, newChannelPrivacy, newChannelName)

        if(newChannelName){
            axios.post("http://localhost:3009/createChannel", {code : props.activeServer, channel :[newChannelName, newChannelPrivacy, messageAccesNewChannel]})
            .then(response => {
                console.log(response)
            })
        }
    }


    const sendServerJoinRequestResponse = (response, userCode) => {//response will be boolean 
        console.log(`Send response for user ${userCode} with response ${response}`)
        axios.post("http://localhost:3009/sendServerJoinRequestResponse", {serverCode : props.activeServer, userCode: userCode, response: response})
            .then(response => {
                console.log(response)
            })
    }

    const eliminateUser = (key) => {//will eliminate the user from the server users
        console.log(`Eliminating user ${key} from the server`)
        axios.post("http://localhost:3009/eliminateUserFromServer", {serverCode : props.activeServer, userCode: key})
            .then(response => {
                console.log(response)
            })
    }


    const deleteServer = () => {
        console.log(`Deleting server ${props.activeServer}`)
        axios.post("http://localhost:3009/deleteServer", {serverCode : props.activeServer})
            .then(response => {
                console.log(response)
            })
    }


    return(
        <div>
            <div className="createChannel">
                <div className="channelNameContainer">
                    <input 
                        placeholder="Channel name" 
                        type={"text"}
                        value={newChannelName}
                        onChange={(e) => {setNewChannelName(e.target.value);}}/>
                    </div>
                <div>
            <input 
                type={"checkbox"} 
                onChange={(e) => {if (e.target.checked){setNewChannelPrivacy("private")} else {setNewChannelPrivacy("public")}}}/>
            <p>Private</p>
                </div>
                    <div>
                        <input 
                            type={"checkbox"} 
                            onChange={(e) => {if (e.target.checked){setMessageAccesNewChannel("public")} else {setMessageAccesNewChannel("private")}}}/>
                        <p>Anyone can send messages</p>
                    </div>
                <button onClick={sendNewChannelData} className="confirmChannel">Create a channel</button>
            </div>
            <div className="globalUserSettings">
                <div className="globalSettingsUsersContainer">
                    join requests
                    {globalSettings && Object.entries(globalSettings.joinRequests).map(([key, value]) => {
                        return(
                        <div className="userCardGlobalSettings" key={value}>
                            <div className="profileImg">imgPic</div>
                            <p className="userCardName">{key}</p>
                            <div className="accept" onClick={() => {sendServerJoinRequestResponse(true, key)}}></div>
                            <div className="refuze" onClick={() => {sendServerJoinRequestResponse(false, key)}}></div>
                        </div>)
                    })}
                </div>
                <div className="globalSettingsUsersContainer">
                    users
                    {globalSettings && Object.entries(globalSettings.users).map(([key, value]) => {
                        console.log(value)
                        return(
                        <div 
                            className="userCardGlobalSettings" 
                            key={value}
                            onMouseEnter={() => {setActiveUserCardSettings(value)}}
                            onMouseLeave={() => {setActiveUserCardSettings()}}>
                            <div className="profileImg">imgPic</div>
                            <p className="userCardName">{value}</p>
                            {activeUserCardSettings === value && 
                                <div className="userCardSettings">
                                        <p className="optionsUserCard" onClick={() => {eliminateUser(key)}}>Eliminate user</p>
                                </div>}
                        </div>
                        )
                    })}
                </div>
            </div>
            <div className="deleteServer" onClick={deleteServer}>
                    Delete the server
            </div>
        </div>
    )

}

export default GlobalSettings;