import "../styles/settings/serverOptions.css";
import { useContext, useState, useEffect } from "react";
import { Context } from "../context/context";
import axios from "axios";
import ChannelSettings from "./channelSettings";
import GlobalSettings from "./globalServerSettings";
import { ContextProviderWebSocket } from "../context/webSocketContext";

const ServerContainer = () => {

    const {name, code} = useContext(Context)
    const [servers, setServers] =useState();
    const [activeServer, setActiveServer] = useState();
    const [channels, setChannels] = useState();
    const [activeChannel, setActiveChannel] = useState();//will have the active server`s code
    const [mainChannel, setMainChannel] = useState();
    const [globalSettings, setGlobalSettings] = useState(false);//will control the dislay of global settings
    const [users, setUsers] = useState()

    console.log(activeChannel)

    useEffect(() => {
        console.log("getting servers info")
        if(code && name){
            axios.post("http://localhost:3009/getOwnedServers", {user: [name, code]})
            .then(response => {
                console.log(response.data.servers);
                setServers(response.data.servers);
            })
        }
    }, [code, name])


    useEffect(() => {

        if(activeServer){
            console.log(`requesting channels from user ${code}`);

            axios.post("http://localhost:3009/getChannels", {code: activeServer, user: code})
            .then(response => {
                console.log(response);
                setChannels(response.data.channels)
                setMainChannel(response.data.mainChannel)
                setUsers(response.data.users)
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

    const changeActiveServer = (serverC) => {
        setActiveServer(serverC);
        setActiveChannel(undefined);
    }

    const changeUserChannelAccesibility = (code, name) => {

            let tempChannels = {...channels}
            let tempActiveChannel = {...activeChannel}

            if(tempChannels[activeChannel.channelName].users[code]){
                delete tempChannels[activeChannel.channelName].users[code];
                delete tempActiveChannel.users[code];
            }else{
                tempChannels[activeChannel.channelName].users[code] = name;
                tempActiveChannel.users[code] = name;
            }

            setChannels({...tempChannels});
            setActiveChannel({...tempActiveChannel});

    }

    const chnageUserMessageAccesibility = () => {

            let tempChannels = {...channels}
            let tempActiveChannel = {...activeChannel}

            if(tempChannels[activeChannel.channelName].usersMessageAcces[code]){
                delete tempChannels[activeChannel.channelName].usersMessageAcces[code];
                delete tempActiveChannel.usersMessageAcces[code];
            }else{
                tempChannels[activeChannel.channelName].usersMessageAcces[code] = name;
                tempActiveChannel.usersMessageAcces[code] = name;
            }

            setChannels({...tempChannels});
            setActiveChannel({...tempActiveChannel});

    }
    

    return(
        <ContextProviderWebSocket>
            <div className="serverDetailedOptionsContainer">
                <section className="servers">
                    {servers && Object.entries(servers).map((server, index) => {
                        return(<p key={index} onClick={() => {changeActiveServer(server[0])}}>{server[1]}</p>)
                    })}
                </section>
                <section className="options">
                    {activeServer && (
                        <div className="optionsContainer">
                            {globalSettings && <GlobalSettings key={activeServer} activeServer={activeServer} />}
                            <div className="channels">
                                <p className="globalSettings" onClick={triggerGlobalSettings}>Global settings</p>
                                <p className="channelsSectionName">Channels</p>

                                {channels && Object.entries(channels).map(([key, value]) => {
                                    return(
                                        <p 
                                            key={key} 
                                            className="channel"
                                            onClick={() => {triggerChannelOptions({channelName: key, ...value})}}>
                                        {key}
                                        </p>)
                                })}

                            </div>
                                {activeChannel &&  
                                    <ChannelSettings
                                        activeChannel={activeChannel} 
                                        mainChannel={mainChannel} 
                                        changeMainChannel={changeMainChannel} 
                                        changeChannelPrivacySettings={changeChannelPrivacySettings}
                                        activeServer={activeServer}
                                        users={users}
                                        changeUserChannelAccesibility={changeUserChannelAccesibility}
                                        chnageUserMessageAccesibility={chnageUserMessageAccesibility}/>}
                        </div>)}
                        
                </section>
            </div>
        </ContextProviderWebSocket>
    )

}

export default ServerContainer;






