import { React, useContext, useState, useEffect }from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { ReactComponent as Logo } from "../img/mb9-logo.svg";
import axios from 'axios';
import { Context } from "../context/context";
import { useCookies } from "react-cookie";
import websocket from "../modules/websocket";

const AuthentificationPage = () => {

  const [cookies, setCookie] = useCookies(["user"]);

  const { type } = useParams();
  const navigate = useNavigate();

  let {setName, setCode} = useContext(Context);

  let [authType, setAuthType] = useState(type);
  let [createAccData, setCreateAccData] = useState({userName:"", password:"", password0:""});
  let [logInData, setLogInData] = useState({userName:"", password:""});
  let [dataErrorNewAcc, setDataErrorNewAcc] = useState(null);//will be used for alerting the user if the data he provides is incorrect
  let [dataErrorLogIn, setDataErrorLogIn] = useState(null);

  const logIn = (username, password) => {
    if(username && password){
      axios.post("http://localhost:3009/logIn", {userName: username, password: password})
        .then(response => {
          if(response.status === 200){
            setName(username);
            setCode(response.data.code);
            setCookie("user", `${username} ${password}`, { path: "/" });
            websocket.send(JSON.stringify({type:"auth", data: {username: username, usercode: response.data.code}}));
            navigate('/chat-page');
          }
        }).catch(err => {
          setDataErrorLogIn("Invalid credentials");
        })
    }else{
      setDataErrorLogIn("Some data is missing");
    }
  }

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

        axios.post("http://localhost:3009/addAcc", createAccData)//addAcc route will be used to craete an account with the sent information, after it was verified
        .then(response => {
          console.log(response.data + " res");
          if(response.status === 200){
            setCode(response.data.usercode);
            setName(createAccData.userName);
            setCookie("user", `${createAccData.userName} ${createAccData.password}`, { path: "/" });
            websocket.send(JSON.stringify({type:"auth", data: {username: createAccData.userName, usercode: response.data.code}}));
            navigate('/chat-page');
          }
        })
        .catch(error => {
          console.error(error.response.data);
          setDataErrorNewAcc(error.response.data);
        });
    }else{
      setDataErrorNewAcc("SOME DATA IS MISSING");
      return undefined;
    }
    setDataErrorNewAcc(null);//if everything is alright it should reach here and reset the value
  }

  const sendLogInData = (e) => {
    e.preventDefault();
    logIn(logInData.userName, logInData.password);
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