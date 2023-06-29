import { useContext, useState } from "react";
import { Context } from "../context/context";
import axios from "axios";

const CreateServer =  (props) => {

    const {name, code} = useContext(Context)

    const [createServerName, setCreateServerName] = useState("");
    const [createServerDescription, setCreateServerDescription] = useState("");

    const handleCreateServerName = (e) => {
        setCreateServerName(e.target.value);
    }

    const handleCreateServerDescription = (e) => {
        setCreateServerDescription(e.target.value);
    }

    const createServer = () => {
        console.log(createServerDescription);
        console.log(createServerName)
        axios.post("http://localhost:3009/createServer", {serverName: createServerName, description: createServerDescription, owner: [name, code]})
            .then((response) => {
                console.log(response);
            })
    }


    return (
        <div className="createServerContainer" onClick={() => {props.close()}}>
            <header className="serverOptionsHeader" onClick={(e) => {e.stopPropagation()}}>
                <p>Create a server</p>
                <div className="createServerOptions">
                    <div className="inputDataContainer">
                        <input 
                            placeholder="Server name"
                            value={createServerName}
                            onChange={handleCreateServerName}/>
                        <input 
                            placeholder="Server description -- optional"
                            value={createServerDescription}
                            onChange={handleCreateServerDescription}/>
                    </div>
                    <div className="optionContainer">
                        {/* {some other options like users/admins/create channels or add users per channel} */}
                    </div>
                </div>
                <button onClick={createServer} className="confirmNewServer">Create</button>
            </header>
        </div>
    )
}

export default CreateServer;