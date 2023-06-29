import axios from "axios";
import { useState, useEffect } from "react";


const GlobalSettings = (props) => {

    const [messageAccesNewChannel, setMessageAccesNewChannel] = useState("private");
    const [newChannelPrivacy, setNewChannelPrivacy] = useState("public");
    const [newChannelName, setNewChannelName] = useState("");
    const [globalSettings, setGlobalSettings] = useState();


    const sendNewChannelData = () => {
        console.log(messageAccesNewChannel, newChannelPrivacy, newChannelName)

        if(newChannelName){
            axios.post("http://localhost:3009/createChannel", {code : props.activeServer, channel :[newChannelName, newChannelPrivacy, messageAccesNewChannel]})
            .then(response => {
                console.log(response)
            })
        }
    }


    useEffect(() => {//will get the global settings data

        axios.post("http://localhost:3009/getGlobalServerSettings", {serverCode: props.activeServer
    })
            .then(response => {
                console.log(response)
            })

    }, [])


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
        </div>
    )

}

export default GlobalSettings;