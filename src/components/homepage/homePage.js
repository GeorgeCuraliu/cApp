import React from "react";
import Navbar from "./navbar";
import HomePageContent from "./HomePageContent";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
    let navigate = useNavigate();
    //in case the app finds a cookie with log in data, it will try to verify the data and send the user to /chat-page url
  if(document.cookie){
    console.log(document.cookie + "  --cookie data found")
    let credentials = document.cookie.split("=")[1].split(" ");//will get the value and after that will take the name and password as separate values
    console.log(credentials[0]+ " "+ credentials[1] + "  credntials found");
    credentials[1] =credentials[1].replace(";", "");

    axios.post("http://localhost:3001/logIn", {userName: credentials[0], password: credentials[1]})//will verify the retrieved data
        .then(response => {
          console.log(`${response.data} validity of credentials`)
            response.data ? navigate('/chat-page') : console.log("The cookie data is invalid")
        })
  }

    return(
        <div style={{ overflow:"hidden"}}>
            <Navbar />
            <HomePageContent />
        </div>
    )
}
export default HomePage;