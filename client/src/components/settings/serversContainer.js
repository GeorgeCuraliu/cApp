import "../styles/settings/serverOptions.css";
import { useContext, useState, useEffect } from "react";
import { Context } from "../context/context";
import axios from "axios";

const ServerContainer = () => {

    const {name, code} = useContext(Context)
    const [servers, setServers] =useState();
    const [activeServer, setActiveServer] = useState();
    const [messageAccesNewChannel, setMessageAccesNewChannel] = useState("private");
    const [newChannelPrivacy, setNewChannelPrivacy] = useState("public");
    const [newChannelName, setNewChannelName] = useState("");
    const [channels, setChannels] = useState();
    const [activeChannel, setActiveChannel] = useState();

    useEffect(() => {
        console.log("getting servers info")
        if(code && name){
            axios.post("http://localhost:3009/getServers", {user: [name, code]})
            .then(response => {
                console.log(response.data);
                setServers(response.data);
            })
        }

    }, [code, name])


    useEffect(() => {

        if(activeServer){
            console.log("requesting channels");

            axios.post("http://localhost:3009/getChannels", {code: activeServer, user: name})
            .then(response => {
                console.log(response);
                setChannels(response.data)
            })

        }

    }, [activeServer])


    const sendNewChannelData = () => {
        console.log(messageAccesNewChannel, newChannelPrivacy, newChannelName)

        if(newChannelName){
            axios.post("http://localhost:3009/createChannel", {code : activeServer, channel :[newChannelName, newChannelPrivacy, messageAccesNewChannel]})
            .then(response => {
                console.log(response)
            })
        }
    }
    

    return(
        <div className="serverDetailedOptionsContainer">
            <section className="servers">
                {servers && Object.entries(servers).map((server, index) => {
                    return(<p key={index} onClick={() => {setActiveServer(server[0])}}>{server[1]}</p>)
                })}
            </section>
            <section className="options">
                {activeServer && (
                    <div className="optionsContainer">

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

                        <div className="channels">
                            {channels && Object.entries(channels).map(([key, value]) => {
                                return(
                                    <p 
                                        key={key} 
                                        className="channel"
                                        onClick={() => {setActiveChannel({channelName: key, acces: value.acces, messageAcces: value.messageAcces})}}>
                                        {key}
                                    </p>)
                            })}

                         </div>
                            {activeChannel &&  
                                <div className="channelOptions">
                                    <div className="channelOptionHeader">
                                        <p>{activeChannel.channelName}</p>
                                        <div className="channelPrivacyOptions">
                                            <div>
                                                <input type={"checkbox"}/>
                                                <p>Privacy</p>
                                            </div>
                                            <div>
                                                <input type={"checkbox"}/>
                                                <p>Anyone can send messages</p>
                                            </div>
                                        </div>

                                    </div>   
                                </div>}
                    </div>)}
            </section>
        </div>
    )

}

export default ServerContainer;