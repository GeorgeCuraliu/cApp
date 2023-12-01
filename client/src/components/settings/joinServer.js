import { useRef, useState, useContext } from "react"
import axios from "axios";
import { Context } from "../context/context";

const JoinServer = (props) => {

    const {name, code} = useContext(Context);
    const serverCode = useRef(undefined);
    const [basicInfo, setBasicInfo] = useState()

    const requestServerData = () => {
        
        if(!isNaN(Number(serverCode.current.value))){
            console.log(`Request server info for join with the code of ${serverCode.current.value}`);
            axios.post("http://localhost:3009/getServerBasicInfo", {code: serverCode.current.value})
                .then((response) => {
                    console.log(response);
                    if(response.status === 200){
                        setBasicInfo(response.data.server);
                    }else{
                        setBasicInfo({wrongName: true});//this key will be used in case thet the code was wrong
                    }
                })
        }

    }

    const sendRequest = () => {
        axios.post("http://localhost:3009/sendServerJoinRequest", {serverCode: serverCode.current.value, sender:[code, name]})
        .then((response) => {
            console.log(response)
        })
    }

    return(
            <div className="joinServerContainer" onClick={() => {props.close()}}>
                    <div className="joinServer" onClick={(e) => {e.stopPropagation()}}>
                        <header>
                            <input 
                                type={"text"} 
                                placeholder={"Type the server code ServerName#code"}
                                ref={serverCode}/>
                            <p onClick={requestServerData}>Search</p>
                        </header>
                        {!basicInfo?.wrongName && basicInfo?.serverName && <div className="serverCardContainer" onClick={sendRequest}>
                            <div className="serverCard">
                                <div className="serverImage"></div>
                                <p>{basicInfo.serverName} #{basicInfo.serverCode}</p>
                            </div>
                        </div>}
                        {basicInfo?.wrongName && basicInfo?.wrongName && <p className="noServerFound">No server found</p>}
                    </div>
            </div>
    )
}

export default JoinServer;