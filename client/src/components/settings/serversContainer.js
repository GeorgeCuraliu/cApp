import "../styles/settings/serverOptions.css";
import { useContext, useState, useEffect } from "react";
import { Context } from "../context/context";
import axios from "axios";
import ChannelSettings from "./channelSettings";
import GlobalSettings from "./globalServerSettings";

const ServerContainer = () => {

    const {name, code} = useContext(Context)
    const [servers, setServers] =useState();
    const [activeServer, setActiveServer] = useState();
    const [channels, setChannels] = useState();
    const [activeChannel, setActiveChannel] = useState();//will have the active server`s code
    const [mainChannel, setMainChannel] = useState();
    const [globalSettings, setGlobalSettings] = useState(false);//will control the dislay of global settings

    console.log(activeChannel)

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
                setChannels(response.data.channels)
                setMainChannel(response.data.mainChannel)
            })

        }

    }, [activeServer])


    const changeChannelPrivacySettings = (setting) => {//will get the name from activeChannel and will just reverse the value

        axios.post("http://localhost:3009/changeChannelPrivacySettings", {serverCode: activeServer, channelName: activeChannel.channelName, setting: setting})
        .then(response => {
            console.log(response)

            let tempObj = {...activeChannel}

            //first change the value in the states, so it the chnage will be visible
            tempObj[setting] === "public" ? tempObj[setting] = "private" : tempObj[setting] = "public" ;
            console.log(`Changing the value of ${setting} setting to ${activeChannel[setting]}`)
            setActiveChannel(tempObj);

            tempObj = {...channels}
            tempObj[activeChannel.channelName][setting] === "public" ? tempObj[activeChannel.channelName][setting] = "private" : tempObj[activeChannel.channelName][setting] = "public";
            setChannels(tempObj)
        })

    }

    const changeMainChannel = () => {//will cahneg the local value of mainChannel, after it changes it to the server and gets the response
        console.log("changing main server")

        axios.post("http://localhost:3009/changeMainChannel", {serverCode: activeServer, channelName: activeChannel.channelName})
        .then(response => {
            console.log(response);
            setMainChannel(activeChannel.channelName)

        })


    }

    const triggerChannelOptions = (vals) => {
        setActiveChannel({...vals});
        setGlobalSettings(false)
    }

    const triggerGlobalSettings = () => {
        setGlobalSettings((val) => !val);
        setActiveChannel();
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
                        {globalSettings && <GlobalSettings activeServer={activeServer} />}
                        <div className="channels">
                            <p className="globalSettings" onClick={triggerGlobalSettings}>Global settings</p>
                            <p className="channelsSectionName">Channels</p>

                            {channels && Object.entries(channels).map(([key, value]) => {
                                return(
                                    <p 
                                        key={key} 
                                        className="channel"
                                        onClick={() => {triggerChannelOptions({channelName: key, acces: value.acces, messageAcces: value.messageAcces, users: value.users, mainChannel: value.mainChannel})}}>
                                    {key}
                                    </p>)
                            })}

                         </div>
                            {activeChannel &&  
                                <ChannelSettings 
                                    activeChannel={activeChannel} 
                                    mainChannel={mainChannel} 
                                    changeMainChannel={changeMainChannel} 
                                    changeChannelPrivacySettings={changeChannelPrivacySettings}/>}
                     </div>)}
                    
            </section>
        </div>
    )

}

export default ServerContainer;






