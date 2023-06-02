import { React, useState }from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { ReactComponent as Logo } from "../img/mb9-logo.svg";
import axios from 'axios';

const AuthentificationPage = () => {
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

  const { type } = useParams();
  const navigate = useNavigate();

  let [authType, setAuthType] = useState(type);
  let [createAccData, setCreateAccData] = useState({userName:"", password:"", password0:""});
  let [logInData, setLogInData] = useState({userName:"", password:""});
  let [dataErrorNewAcc, setDataErrorNewAcc] = useState(null);//will be used for alerting the user if the data he provides is incorrect
  let [dataErrorLogIn, setDataErrorLogIn] = useState(null);

  const handleBtnClick = (currentType) => {
    setAuthType(currentType);
  };


  const logInDataChange = (e) => {//will change log in data
    const {name, value} = e.target;
    setLogInData((logInData) => ({
      ...logInData,
      [name]: value
    }))
  } 

  const createAccDataChange = (e) => {//will cahnge new user data
    const {name, value} = e.target;
    setCreateAccData((createAccData) => ({
      ...createAccData,
      [name]: value
    }))
  }
  console.log(`${dataErrorNewAcc} -- current error`)


  const sendNewAcc = async (e) => {
    e.preventDefault();
    if(createAccData.userName && createAccData.password && createAccData.password0){//checks if the data exits
        console.log(`New account data detected ${createAccData.userName},  ${createAccData.password}, ${createAccData.password0}`);
        if(createAccData.userName.length < 3){setDataErrorNewAcc("USER NAME TOO SHORT"); return undefined}//checks all the conditions so the data is valid for a new account
        if(createAccData.userName.length > 15){setDataErrorNewAcc("USER NAME TOO LONG"); return undefined}
        if(createAccData.password !== createAccData.password0){setDataErrorNewAcc("PASSWORDS DO NOT MATCH"); return undefined}
        if(createAccData.password.length < 4){setDataErrorNewAcc("PASSWORDS TOO SHORT"); return undefined}

        axios.post("http://localhost:3001/addAcc", createAccData)//addAcc rouute will be used to craete an account with the sent information, after it was verified
        .then(response => {
          console.log(response.data[1]);
          if(response.data[0] !== 0){setDataErrorNewAcc(response.data[1]);}//updating the error if the data was accepted and processed
          else{//redirect to the chat page and set a cookie for authentification
            document.cookie = `user=${createAccData.userName} ${createAccData.password}`;
            navigate('/chat-page');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }else{
      setDataErrorNewAcc("SOME DATA IS MISSING");
      return undefined;
    }
    setDataErrorNewAcc(null);//if everything is alright it should reach here and reset the value
  }

  const sendLogInData = (e) => {
    e.preventDefault();

    if(logInData.userName && logInData.password){
      axios.post("http://localhost:3001/logIn", logInData)
        .then(response => {
          console.log(`${response.data} validity of credentials`)
          if(response.data){
            document.cookie = `user=${logInData.userName} ${logInData.password}`;
            navigate('/chat-page');
          }else{setDataErrorLogIn("Invalid credentials")}
        })
    }else{
      setDataErrorLogIn("Some data is missing");
    }
  }

  return (
    <div className="auth-container">
      <section>
        {authType === "logIn" && (
          <form onSubmit={sendLogInData}>
            <div className="logo-container">
              <Logo className="logo"/>
            </div>
            <input
              name="userName" 
              type="text" 
              placeholder="USER NAME" 
              value={logInData.userName}
              onChange={logInDataChange}
              min={3}
              max={10}/>
            <input 
              type="password" 
              placeholder="PASSWORD" 
              name="password"
              value={logInData.password}
              onChange={logInDataChange}/>
            {dataErrorLogIn && <p>{dataErrorLogIn}</p>}
            <button type="confirm" className="confirm">Confirm</button>
            <button className="changeAuthBtn" onClick={() => handleBtnClick("createAccount")}>
              Dont have an account? Create one!
            </button>
          </form>
        )}
        {authType === "createAccount" && (
          <form onSubmit={sendNewAcc}>
            <div className="logo-container">
              <Logo className="logo"/>
            </div>
            <input 
              type="text" 
              placeholder="USER NAME" 
              name="userName"
              onChange={createAccDataChange}
              value={createAccData.userName}
              min={3}
              max={15}/>
            <input 
              type="password" 
              placeholder="PASSWORD" 
              name="password"
              onChange={createAccDataChange}
              value={createAccData.password}
              min={4}/>
            <input 
              type="password" 
              placeholder="CONFIRM THE PASSWORD"
              name="password0"
              onChange={createAccDataChange}
              value={createAccData.password0}
              min={4}/>
            {dataErrorNewAcc && <p>{dataErrorNewAcc}</p>}
            <button type="confirm" className="confirm">Confirm</button>
            <button className="changeAuthBtn" onClick={() => handleBtnClick("logIn")}>
              Already have an account? Log in!
            </button>
          </form>
        )}
        <div className="google-container"><div className="g-signin2" data-onsuccess="onSignIn">SIGN-IN WITH GOOGLE</div></div>  {/*feature in work*/}
      </section>
    </div>
  );
};

export default AuthentificationPage;