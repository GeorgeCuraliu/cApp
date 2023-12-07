import React from "react";
import UserCard from "./user-card";
import { useState } from "react";
import axios from 'axios';

const SendPage = () => {

    let [foundUsers, setFoundUsers] = useState([]);
    let [searchVal, setSearchVal] = useState("");

    const handleChange = (e) => {
        e.preventDefault()
        const val = e.target.value;
        console.log(val);
        setSearchVal(val);
      }

    const sendSearchVal =(e) => {
        e.preventDefault();
        console.log(searchVal)
        axios.post("http://localhost:3009/findUsers", { searchVal: searchVal })//addAcc rouute will be used to craete an account with the sent information, after it was verified
        .then(response => {
            setFoundUsers(response.data.foundUsers);
            console.log("Found users response received");
            console.log(response.data)
        })
        .catch(error => {
          console.error(error);
        });
    }

    return(
        <div className="requestContainer">
            <div className="requestContainer2">
                <form onSubmit={sendSearchVal}>
                    <input
                    onChange={handleChange}
                    value={searchVal}
                    placeholder="Type the name here"/>
                    <button type="confirm">Search</button>
                </form>
                <div className="foundUsersContainer">
                    {foundUsers.map((elemenet, index) => {
                       return <UserCard key={index} userName={elemenet[0]} code={elemenet[1]} />
                    })}
                </div>    
            </div>
        </div>
    )
}

export default SendPage;