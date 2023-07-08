// //WS-CONNECTION
// const WebSocket = require('ws')

// const wss = new WebSocket({port: 3009})


// wss.on('connection', function connection(ws){
//   ws.on('message', function message(data){
//     console.log(data)
//   })

//   ws.send("connection-ready")
// })





































const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3009;

app.use(cors());
app.use(express.json());














//AUTHENTIFICATION / LOG IN

app.post('/addAcc', async (req, res) => {
  // req is the request sent to the server and in req in the post obj
  //the /addAcc will return an array that has an status code(812-server error, 978-data error, 0-everything alright) an return array
  // the template object for the user
  const userData = {
    "userName": req.body.userName,
    "password": req.body.password,
    "userImage": false,
    "friends" : {},//for this 3 i should use both the name and the appCode
    "sentFriendRequest": {},
    "receivedFriendRequest": {},
    "ownServers":{},
    "memberInServers": {}
  };

  //acces the app data and get the user order number
  fs.readFile('data/MB9DATA.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.send([812,"A server error occurred accessing the app data, please try again later"]); // in case that the server can't access the app data
    }

    const jsonData = JSON.parse(data);

    for(let user in jsonData.users){//will assure that the sername is free
      if(user === req.body.userName){return res.send([978, "The user name is already used, please choose another one"]);}
    }

    jsonData.users[req.body.userName] = [req.body.password, jsonData.currentUserOrder];//add the user info to the user data in server data(just name, password and code);

    let number = jsonData.currentUserOrder; // Access the current user number order
    let userJsonData = JSON.stringify(userData);

    // access the users folder inside the data and create a user .json file with the data
    fs.writeFile(`data/users/${number}.json`, userJsonData, (err) => {
      if (err) {
        console.log(err);
        return res.send([812, "A server error occurred while creating the user data, please try again later"]);
      }

      jsonData.currentUserOrder += 1; // increase the number order;

      //now update the server data json file with the new values
      fs.writeFile('data/MB9DATA.json', JSON.stringify(jsonData), (err) => {
        if (err) {
          console.log(err);
          return res.send(812, ["A server error occurred while updating the app data, please try again later"]);
        }

        res.send([0, `Data for new account received successfully`, number]); // send() === return 
      });
    });
  });
});



app.post(`/logIn`, (req, res) => {//will handle log in
  fs.readFile("data/MB9DATA.json", (err, jsonData) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }

    let data = JSON.parse(jsonData);
    let users = data.users;

    for (let user in users) {
      if (user === req.body.userName && users[user][0] === req.body.password) {
        return res.send([true, users[user][1]]);
      }
    }
    return res.send([false]);
  });
});





















//FRIEND REQUESTS






//this functions will handle the rersponse to a friend request
const acceptRequest = async (data) => {
  let chatCode;

  try {
  
    await deleteRequest(data.sender[1], "receivedFriendRequest", data.receiver[0]);
  
    await deleteRequest(data.receiver[1], "sentFriendRequest", data.sender[0]);
  
    chatCode = await addConverstaionJSON(data.receiver[1], data.sender[0], data.receiver[1], data.receiver[0]);
  
    await addFriend(data.receiver[1], data.sender[1], data.sender[0], chatCode);
  
    await addFriend(data.sender[1], data.receiver[1], data.receiver[0], chatCode);
  
    return true;
  } catch (error) {
    console.log(error);
    return "An error occurred.";
  }

}

const refuseRequest = async (data) => {

  //delete the request from the sender data
  try{
    await deleteRequest(data.sender[1], "receivedFriendRequest", data.receiver[0])
  }catch{
    return "can`t acces the sender data -- request delete process";
  }

  try{
    await deleteRequest(data.receiver[1], "sentFriendRequest", data.sender[0])
  }catch{
    return "can`t acces the receiver data -- request delete process";
  }

  return true

}

//user will be seacrhed in the requests obj to be deleted
const deleteRequest = (code, type, user) => {

  return new Promise((resolve, reject) => {

    fs.readFile(`data/users/${code}.json`, (err, jsonData) => {

      if (err) {
        console.log(err);
        reject(err);
      }

      let data = JSON.parse(jsonData);
      console.log(`${data[type][user]} code request will be deleted -- ${code} -- ${type} -- ${user}`);
      delete data[type][user];

      fs.writeFile(`data/users/${code}.json`, JSON.stringify(data), err => {

        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(true);

      });
    });
  });
};

//will be used to add a friend after the request from json file was deleted
const addFriend = (host, code, name, chatCode) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`data/users/${host}.json`, (err, jsonData) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      console.log(`reading the data of the user -- ${host} -- add friend`)
      try {
        let data = JSON.parse(jsonData);
        data.friends[name] = [code, new Date(), chatCode];//new date will determine since when this 2 users are friends

        fs.writeFile(`data/users/${host}.json`, JSON.stringify(data), err => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }

          resolve(true);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  });
};


const addConverstaionJSON = (firstID, firstName, secondID, secondName) => {//will craete a json file with specific data about this conversation

  console.log(`creating chat file JSON -- ${firstID} -- ${firstName} -- ${secondID} -- ${secondName}`);

  const chatData = {//data stored in the json file
    user1: [firstName, firstID],
    user2: [secondName, secondID],
    messages: {},
    lastMessageNumber: 0
  }

  return new Promise((resolve, reject) => {

  fs.readFile("data/MB9DATA.json", (err, jsonData) => {
    if(err){
      console.log(err);
      reject(err);
    }

    let data = JSON.parse(jsonData);
    let fileNumb = data.currentChatFileNumber;
    data.currentChatFileNumber ++;

    fs.writeFile("data/MB9DATA.json", JSON.stringify(data), (err) => {
      if(err){
        console.log(err);
        reject(err);
      }
    });

    fs.writeFile(`data/chats/${fileNumb}.json`, JSON.stringify(chatData), (err) => {
      if(err){
        console.log(err);
        reject(err);
      }

      resolve(fileNumb);

    });

  });

  })
}


app.post("/findUsers", (req, res) => {

    console.log(req.body.searchVal);

    function calculateLevenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;
      
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
      
        for (let i = 0; i <= m; i++) {
          dp[i][0] = i;
        }
      
        for (let j = 0; j <= n; j++) {
          dp[0][j] = j;
        }
      
        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
              dp[i][j] = dp[i - 1][j - 1];
            } else {
              dp[i][j] =
                1 +
                Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
          }
        }
      
        return dp[m][n];
      }
      
      function findClosestMatches(searchString, users) {
        const userKeys = Object.keys(users);
      
        const closestMatches = userKeys
          .map((key) => ({
            key,
            distance: calculateLevenshteinDistance(searchString, key),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 6)
          .map(({ key }) => [key, users[key][1]]);
      
        return closestMatches;
      }

    fs.readFile("data/MB9DATA.json", (err, jsonData) => {
        if (err) {
          return res.status(500).send("Error reading file");
        }

        const data = JSON.parse(jsonData);
        const foundUsers = findClosestMatches(req.body.searchVal, data.users);

        return res.send(foundUsers);

    })

})


app.post("/send",async (req, res) => {//body.sender will have the name of sender, and the body.receiver will have both code and name
    console.log("friend request endpoint accesed")
    //retrieve the code of sender from MB9DATA.json
    
    let sender = req.body.sender[1];//i will decalre before the try statement so i the sender code can be accesed in hole function

    

      fs.readFile(`data/users/${req.body.receiver[1]}.json`, (err, jsonData) => {//receiver[1] will have the reciver code
          if (err) {
              return res.status(500).send("Error adding request data");
          }

          let reqData = JSON.parse(jsonData);
          reqData.receivedFriendRequest[req.body.sender[0]] = sender;

          fs.writeFile(`data/users/${req.body.receiver[1]}.json`, JSON.stringify(reqData), err => {
              if (err) {
                  return res.status(500).send("Error adding request data");
              }

                //now add data to the sender
              fs.readFile(`data/users/${sender}.json`, (err, jsonData) => {
                  if (err) {
                      return res.status(500).send("Error adding request data");
                  }
                    
                  let senderData = JSON.parse(jsonData);
                  senderData.sentFriendRequest[req.body.receiver[0]] = req.body.receiver[1];

                  fs.writeFile(`data/users/${sender}.json`, JSON.stringify(senderData), err => {
                      if (err) {
                          return res.status(500).send("Error adding request data");
                      }else{
                          return res.send("Request sent succesfuly");
                      }
                  })

              })
          })
      })

})

app.post("/userReceivedRequests", (req, res) => {
    console.log("searching endpoint for available friend requests accesed");

    fs.readFile("data/MB9DATA.json", (err, jsonData) => {
        if (err) {
            return res.status(500).send("Error reading the data");
        }

        let userCode = JSON.parse(jsonData).users[req.body.userName][1];

        fs.readFile(`data/users/${userCode}.json`, (err, jsonData) => {
            if (err) {
                return res.status(500).send("Error accesing user data");
            }

            let receivedRequests = JSON.parse(jsonData).receivedFriendRequest;
            console.log("friend requests received")

            return res.send(receivedRequests);
        })
        
    })
})


app.post("/requestReponse", async (req, res) => {//i will receive the type(accepted/ refused), from(just the name) and to(both the name and code)

    console.log(`request response endpoint accesed with the repsonse of ${req.body.response}`)
    //this endpoint will just decide which function should be trigerred
    if(req.body.response){

      let senderCode = await acceptRequest({sender: req.body.sender, receiver: req.body.receiver})
      return res.send(senderCode);

    }else{
      let reqRes = await refuseRequest({sender: req.body.sender, receiver: req.body.receiver})
      return res.send(reqRes);
    }

})






























//FRIENDS CHAT








app.post("/getFriends", (req, res) => {

  if(!req.body.code){return res.send(false)}

  console.log(`friends data request from ${req.body.code}`)

  fs.readFile(`data/users/${req.body.code}.json`, (err, jsonData) => {
      if (err) {
        return res.status(500).send("Error reading file");
      }
      console.log("returning friends data")
      let data = JSON.parse(jsonData);
      console.log(data.friends)
      return res.send(data.friends);
      
    });

})

app.post("/sendMessage", (req, res) => {//req.body.sender[name, code]      req.body.receiver[name, code]   req.body.message{message ... }    req.body.chatNumber

console.log(`endpoint for sending an message accesed by ${req.body.sender[0]} to ${req.body.receiver[0]}`)

fs.readFile(`data/chats/${req.body.chatNumber}.json`, (err, Jdata) => {

    if(err){
      console.error(err);
      return res.send("Couldnt acces chat data")
    }

    let data = JSON.parse(Jdata);
    let messageIndex = data.lastMessageNumber;//retrieve the index of this message
    data.lastMessageNumber++;

    const message = {//this objec
      message: req.body.message.message,
      by: req.body.sender
    }

    data.messages[messageIndex] = message;

    fs.writeFile(`data/chats/${req.body.chatNumber}.json`, JSON.stringify(data), (err) => {
        if(err){
          return res.send(err);  
        }else{
          return res.send("Message sent without any error")
        }
    });

})

})

app.post("/getMessages", (req, res) => {
console.log(`endpoint for getting messages accessed for file ${req.body.chatCode}`);

fs.readFile(`data/chats/${req.body.chatCode}.json`, (err, JSONdata) => {
  if (err) {
    return res.send(err);
  }

  if(req.body.index <= 0){//to dont return any messages, beacuse it reached the bottom
    console.log("No messages remaining");
    return res.send("No messages remaining");
  } 


  let data = JSON.parse(JSONdata);
  let messages = [];
  let max;
  let min;

  console.log(req.body.index);

  if (req.body.index) {//for first request will return last 20 messages, after for every will return 10
    console.log(`index received ${req.body.index}`);
    max = req.body.index;
    min = max - 9;
  } else {
    console.log("no index received, creating one");
    max = parseInt(data.lastMessageNumber) - 1;
    min = max - 19;
  }

  console.log(max);

  for (let i = max; i >= min; i--) {
    if (data.messages[i]) {
      messages.push(data.messages[i]);
    }
  }
  console.log(messages);

  return res.send({ messages: messages, lastIndex: min - 1 });
});
});




























//SERVERS CHAT -- HANDLES CHATTING IN SERVERS(GROUPS), LOADING THE USER AVAILABLE SERVERS, OR OTHER OPERATIONS SUCH THIS




app.post("/getServers", (req, res) => {//req.body.user[name, code]

  console.log(`Request for accesing servers for user ${req.body.user[1]}`);

  fs.readFile(`data/users/${req.body.user[1]}.json`, (err, jsonData) => {
    if(err){
      return res.send("Couldnt acces user data");
    }

    let data = JSON.parse(jsonData);
    console.log(data.memberInServers);

    return res.send(data.memberInServers);

  })

})


app.post("/getOwnedServers", (req, res) => {//req.body.user[name, code]

  console.log(`Request for accesing servers for user ${req.body.user[1]}`);

  fs.readFile(`data/users/${req.body.user[1]}.json`, (err, jsonData) => {
    if(err){
      return res.send("Couldnt acces user data");
    }

    let data = JSON.parse(jsonData);
    console.log(data.ownServers);

    return res.send(data.ownServers);

  })

})

app.post("/createChannel", (req, res) => {//req.body.code (the code of server) req.body.channel[name, privacy(public/private -- for view), messagePrivacy(if any user can send an message)]
  console.log(`creating a channel for server ${req.body.code}`)

  fs.readFile(`data/servers/${req.body.code}.json`, (err, jsonData) => {
    if(err){return res.send("Couldnt acces the server data")}

    const channel = {//creating the obj for the channel, that will be inside the server data
      users:{},//creating an user object in case the owner changes the acces to private, so he have to invite users
      acces:req.body.channel[1],
      messageAcces:req.body.channel[2],
      messages:{},
      usersMessageAcces:{}
    }

    let data = JSON.parse(jsonData);

    data.channels[req.body.channel[0]] = channel;

    fs.writeFile(`data/servers/${req.body.code}.json`, JSON.stringify(data), err => {
      if(err){return res.send("Couldnt write the file, i say its user fault, never the developer")}
      return res.send("New channel created")
    })
  })

})


//will return the server`s users to
app.post("/getChannels", (req, res) => {//req.body.code(server code) req.body.user(so the endpoint will know the accesibility of user and will select what to return)
  console.log(`Requesting channels for the server ${req.body.code}`);

  fs.readFile(`data/servers/${req.body.code}.json`, (err, jsonData) => {
    if(err){return res.send("Couldnt acces server data and i blame the user")}

    let data = JSON.parse(jsonData);
    let response = {};

    if(data.owner[0] === req.body.user){//will return all the the channels if the owner is accesing the endpoint

      Object.entries(data.channels).map(([key, value]) => {
        response[key] = {acces: value.acces, messageAcces: value.messageAcces, users: value.users, usersMessageAcces: value.usersMessageAcces}
      })

      return res.status(200).send({channels: response, mainChannel: data.mainChannel, users: data.users});
    }
  })

})

app.post("/changeChannelPrivacySettings", (req,res) => {//req.body.serverCode   req.body.setting  req.body.channelName 

  fs.readFile(`data/servers/${req.body.serverCode}.json`, (err, jsonData) => {
    if(err){return res.send("Couldnt acces the server data")}

    let data = JSON.parse(jsonData);
    data.channels[req.body.channelName][req.body.setting] === "public" ? data.channels[req.body.channelName][req.body.setting] = "private" : data.channels[req.body.channelName][req.body.setting] = "public";

    fs.writeFile(`data/servers/${req.body.serverCode}.json`, JSON.stringify(data), ( err ) => {
      if(err){return res.send("Couldnt write the server data")}

      return res.send("The change was succesfuly saved");

    })

  })

})


app.post("/changeMainChannel", (req, res) => {//req.body.serverCode    req.body.channelName

  console.log(`Changing server main channel to ${req.body.channelName}`)

  fs.readFile(`data/servers/${req.body.serverCode}.json`, (err, jsonData) => {
    if(err){return res.send("Couldnt acces server data")}

    let data = JSON.parse(jsonData);
    data.mainChannel = req.body.channelName

    fs.writeFile(`data/servers/${req.body.serverCode}.json`, JSON.stringify(data), err => {
      if(err){return res.send("Couldnt write the new data, its the user`s fault")}

      return res.send(`Main channel changed succesfully to ${data.mainChannel}`)
    })

  })

})
























//SETTINGS




app.post("/createServer", (req, res) => {
  console.log("Creating a server");

  fs.readFile("data/MB9DATA.json", (err, jsonData) => {
    if (err) {
      return res.send("Error reading app data");
    }

    let dataApp = JSON.parse(jsonData);
    dataApp.currentServerNumber = dataApp.currentServerNumber + 1;// for some reason dataApp.currentServerNumber++ wont work, yhay :)
    const serverCode = dataApp.currentServerNumber;

    const serverData = {//template code for the server data
      name: req.body.serverName,
      description: req.body.description,
      owner: [...req.body.owner],
      joinRequests:{},
      users: {},
      channels: {},
      mainChannel : ""
    };

    fs.writeFile("data/MB9DATA.json", JSON.stringify(dataApp), (err) => {
      if (err) {
        return res.send("Could not write application data");
      }

      fs.writeFile(`data/servers/${serverCode}.json`, JSON.stringify(serverData), (err) => {
        if (err) {
          return res.send("Error creating save data for this server");
        } else {
          fs.readFile(`data/users/${req.body.owner[1]}.json`, (err, jsonData) => {
            if (err) {
              return res.send("Error accessing user data");
            }

            let data = JSON.parse(jsonData);
            data.ownServers[serverCode] = req.body.serverName;
            data.memberInServers[serverCode] = req.body.serverName;

            fs.writeFile(`data/users/${req.body.owner[1]}.json`, JSON.stringify(data), (err) => {
              if (err) {
                return res.send("Could not write the user data");
              } else {
                console.log(`This server will have code ${serverCode}`);
                return res.send("Server created successfully");
              }
            });
          });
        }
      });
    });
  });
});



app.post("/getServerBasicInfo", (req, res) => { //this endpoint will return some basic info about the server for a possible join request

  fs.readFile(`data/servers/${req.body.code}.json`, (err, jsonData) => {
    if(err){ return res.status(204).send()}

    let data = JSON.parse(jsonData);
    let basicInfo = {};
    basicInfo.serverName = data.name;
    basicInfo.serverCode = req.body.code;

    return res.status(200).send(basicInfo);
    
  })
})

app.post("/sendServerJoinRequest", (req, res) => {//req.body.serverCode  req.body.sender[code, name]

  fs.readFile(`data/servers/${req.body.serverCode}.json`, (err, jsonData) => {
    if(err){return res.status(404)}

    let data = JSON.parse(jsonData);
    data.joinRequests[req.body.sender[0]] = req.body.sender[1];

    fs.writeFile(`data/servers/${req.body.serverCode}.json`, JSON.stringify(data), err => {
      if(err){return res.status(404)}
      return res.status(200).send();
    })
  })

})


app.post("/sendServerJoinRequestResponse", (req, res) => {//req.body.response(true/false)  req.body.userCode req.body.serverCode

  fs.readFile(`data/servers/${req.body.serverCode}.json`, (err, jsonData) => {
    if(err){return res.status(404).send()}

    let data = JSON.parse(jsonData);

    if(req.body.response){
      data.users[req.body.userCode] = data.joinRequests[req.body.userCode];
    }

    delete data.joinRequests[req.body.userCode];

    fs.writeFile(`data/servers/${req.body.serverCode}.json`, JSON.stringify(data), err => {
      if(err){return res.status(404).send()}
      return res.status(200).send(`Response for the user ${req.body.userCode} was succesfully applied for the case ${req.body.response}`);
    })

  })

})


app.post("/getGlobalServerSettings", (req, res) => {//req.body.serverCode 
  
  fs.readFile(`data/servers/${req.body.serverCode}.json`, (err, jsonData) => {
    if(err){return res.status(404)}

    let data = JSON.parse(jsonData);
    let globalSettings = {//will contain just data about global settings
      joinRequests : data.joinRequests,
      users : data.users
    };
    console.log(data.joinRequests);
    
    return res.status(200).send(globalSettings);

  })
})


app.post("/eliminateUserFromServer", (req, res) => {//req.body.serverCode  req.body.userCode

  fs.readFile(`data/servers/${req.body.serverCode}.json`, (err, jsonData) => {
    if(err){return res.status(404).send()}

    let data = JSON.parse(jsonData);


    delete data.users[req.body.userCode];

    fs.writeFile(`data/servers/${req.body.serverCode}.json`, JSON.stringify(data), err => {
      if(err){return res.status(404).send()}
      return res.status(200).send(`User ${req.body.userCode} eliminated succesfully`);
    })

  })

})


app.post("/deleteServer", (req, res) => {//req.body.serverCode

  fs.readFile(`data/servers/${req.body.serverCode}.json`, (err, jsonData) => {//accesing the data pf the server that will be deleted so we can ermove the users and owners data of this server
    if(err){return res.status(203).send()}

    let serverData = JSON.parse(jsonData);

    fs.readFile(`data/users/${serverData.owner[1]}.json`, (err, jsonData) => {//will delete the owner`s data about the server
      if(err){return res.status(203).send()}

      let userData = JSON.parse(jsonData);

      delete userData.ownServers[req.body.serverCode];

      fs.writeFile(`data/users/${serverData.owner[1]}.json`, JSON.stringify(userData), err => {
        if(err){return res.status(203).send()}

        Object.keys(serverData.users).forEach(element => {//will delete every users`s data about the server

          fs.readFile(`data/users/${element}.json`, (err, jsonData) => {
            if(err){return res.status(203).send()}

            let tempUserData = JSON.parse(jsonData);

            delete tempUserData.memberInServers[req.body.serverCode];

            fs.writeFile(`data/users/${element}.json`, JSON.stringify(tempUserData), err => {if(err){return res.status(203).send()}})

          })

        })

        fs.unlink(`data/servers/${req.body.serverCode}.json`, err => {//will delete the server`s file
          if(err){return res.status(203).send()}
      
          return res.status(200).send(`Server ${req.body.serverCode} deleted`)
        })

      })

    })

  })



})


app.post("/changeUserAccesiblityChannel", (req, res) => {//req.body.serverCode  req.body.channel  req.body.user[code, name]

  fs.readFile(`data/servers/${req.body.serverCode}.json`, (err, jsonData) => {
    if(err){return res.status(404).send()}

    let data = JSON.parse(jsonData);

    if(data.channels[req.body.channel].users[req.body.user[0]]){//will reverse the acces of the user to the channel
      delete data.channels[req.body.channel].users[req.body.user[0]];
    }else{
      data.channels[req.body.channel].users[req.body.user[0]] = req.body.user[1];
    }

    fs.writeFile(`data/servers/${req.body.serverCode}.json`, JSON.stringify(data), err => {
      if(err){return res.status(404).send()}

      return res.status(200).send()
    })

  })

})


app.post("/changeUserMessageAcces", (req, res) => {//req.body.serverCode  req.body.channel  req.body.user[code, name]

  fs.readFile(`data/servers/${req.body.serverCode}.json`, (err, jsonData) => {
    if(err){return res.status(404).send()}

    let data = JSON.parse(jsonData);

    if(data.channels[req.body.channel].usersMessageAcces[req.body.user[0]]){//will reverse the acces of the user to the channel
      delete data.channels[req.body.channel].usersMessageAcces[req.body.user[0]];
    }else{
      data.channels[req.body.channel].usersMessageAcces[req.body.user[0]] = req.body.user[1];
    }

    fs.writeFile(`data/servers/${req.body.serverCode}.json`, JSON.stringify(data), err => {
      if(err){return res.status(404).send()}

      return res.status(200).send()
    })

  })

})







  
    





































































app.listen(port, () => {
  console.log("Local server is running, time to chat :)")
})
