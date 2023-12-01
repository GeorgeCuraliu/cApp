// //WS-CONNECTION
// const WebSocket = require('ws')

// const wss = new WebSocket({port: 3009})


// wss.on('connection', function connection(ws){
//   ws.on('message', function message(data){
//     console.log(data)
//   })

//   ws.send("connection-ready")
// })




































const Sequelize = require(`sequelize`);
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3009;

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.db',
  logging: false
});





//DEFINTE THE TABLE MODELS
const MB9DATA_TB = {
  currentUserOrder: {
    type:Sequelize.DataTypes.INTEGER
  },
  currentChatFileNumber: {
    type:Sequelize.DataTypes.INTEGER
  },
  currentServerNumber: {
    type:Sequelize.DataTypes.INTEGER
  }
}

const Users_TB = {
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  password:{
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  usercode:{
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  },
  profilePicture: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false
  },
  admin: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false
  }
}

const Friends_TB = {
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  usercode:{
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  },
  friendsSince: {
    type: Sequelize.DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW()
  },
  chatCode: {
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  }
}

const ReceivedFriendRequests_TB = {
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  usercode:{
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  }
}

const SentFriendRequests_TB = {
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  usercode:{
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  }
}

const userChat_TB = {
  message: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  byUsername: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  byUsercode: {
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  }
}

const OwnedServers_TB = {
  servername: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  servercode:{
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  }
}

const MemberInServers_TB = {
  servername: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  servercode:{
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  }
}






const Servers_TB = {
  servername:{
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  servercode: {
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  },
  description: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  ownername: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  ownercode: {
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  },
  mainChannel : {
    type: Sequelize.DataTypes.STRING
  }
}

const JoinRequestsServer_TB = {
  username:{
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  usercode: {
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  }
}

const ServerUsers_TB = {
  username:{
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  usercode: {
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  }
}

const Channels_TB = {
  access: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  messageAcces: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  }
}

const ChannelUsers_TB = {
  username:{
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  usercode: {
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  },
  messageAccess:{
    type: Sequelize.DataTypes.BOOLEAN,
    default: false
  }
}

const ChannelMessages_TB = {
  index: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  message: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  sentBy: {
    type: Sequelize.DataTypes.NUMBER,
    allowNull: false
  },
  sentAt: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  }
}







//SEQUELIZE GLOBAL METHODS AND VARS
let Users;
let Servers;
let MB9DATA;

accesTables = (async () => {

  MB9DATA = sequelize.define("MB9DATA", MB9DATA_TB, {freezeTableName: true});
  await MB9DATA.sync();

  Users = sequelize.define("Users", Users_TB, {freezeTableName: true});
  await MB9DATA.sync();

  Servers = sequelize.define("Servers", Servers_TB, {freezeTableName: true});
  Servers.sync();

  console.log("accesed the global tables");

  return {Servers, Users, MB9DATA};
})()


const getCurrentUsercode = async () => {
  let table = await MB9DATA.findAll();
  table = table[0].dataValues;//[0].dataValues will access the actual values of the table
  await MB9DATA.update({currentUserOrder: table.currentUserOrder+1}, {where: {currentUserOrder: table.currentUserOrder}});
  return table.currentUserOrder;
}
const getCurrentServercode = async () => {
  let table = await MB9DATA.findAll();
  table = table[0].dataValues;//[0].dataValues will access the actual values of the table
  await MB9DATA.update({currentServerNumber: table.currentServerNumber+1}, {where: {currentServerNumber: table.currentServerNumber}});
  return table.currentServerNumber;
}
const getCurrentChatcode = async () => {
  let table = await MB9DATA.findAll();
  table = table[0].dataValues;//[0].dataValues will access the actual values of the table
  await MB9DATA.update({currentChatFileNumber: table.currentChatFileNumber+1}, {where: {currentChatFileNumber: table.currentChatFileNumber}});
  return table.currentChatFileNumber;
}




















//AUTHENTIFICATION
app.post('/addAcc', async (req, res) => {

  Users.sync();

  let usernameMatches = await Users.findAll({where: {username: req.body.userName}});
  console.log(usernameMatches[0]);
  if(usernameMatches[0]?.dataValues){return res.status(409).json("The user name is already used, please choose another one")};

  let usercode = await getCurrentUsercode();
  await Users.sync().then(async () => {
    Users.create({
      username: req.body.userName,
      password: req.body.password,
      usercode: usercode
    });
  })

  await sequelize.define(`CA_friends_${usercode}`, Friends_TB, {freezeTableName: true}).sync();//create the necessary tables for the user
  await sequelize.define(`CA_receivedFriendRequests_${usercode}`, ReceivedFriendRequests_TB, {freezeTableName: true}).sync();
  await sequelize.define(`CA_sentFriendRequests_${usercode}`, SentFriendRequests_TB, {freezeTableName: true}).sync();
  await sequelize.define(`CA_ownServers_${usercode}`, OwnedServers_TB, {freezeTableName: true}).sync();
  await sequelize.define(`CA_memberInServers_${usercode}`, MemberInServers_TB, {freezeTableName: true}).sync();

  return res.status(200).json({usercode});
})

app.post(`/logIn`, async (req, res) => {//will handle log in
  Users.sync();
  const matches = await Users.findAll({where: {username: req.body.userName, password: req.body.password}});
  if(matches[0]?.dataValues){
    return res.status(200).json({code: matches[0].dataValues.usercode});
  }else{
    return res.sendStatus(404);
  }
});























//FRIEND REQUESTS

//this functions will handle the rersponse to a friend request
const acceptRequest = async (data) => {
  let chatCode;

  try {
  
    await deleteRequest(data.sender[1], "receivedFriendRequests", data.receiver[0]);
  
    await deleteRequest(data.receiver[1], "sentFriendRequests", data.sender[0]);
  
    chatCode = await addConverstaionTB(data.receiver[1], data.sender[0], data.receiver[1], data.receiver[0]);
  
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
    await deleteRequest(data.sender[1], "receivedFriendRequests", data.receiver[0])
  }catch{
    return "can`t acces the sender data -- request delete process";
  }

  try{
    await deleteRequest(data.receiver[1], "sentFriendRequests", data.sender[0])
  }catch{
    return "can`t acces the receiver data -- request delete process";
  }

  return true

}

//user will be seacrhed in the requests obj to be deleted
const deleteRequest = (code, type, user) => {
  console.log(`deleteRequest  ${code}    ${type}    ${user}`);
  return new Promise(async(resolve, reject) => {

    const TB_Model = type == "sentFriendRequests" ? SentFriendRequests_TB : ReceivedFriendRequests_TB;

    const table = await sequelize.define(`CA_${type}_${code}`, TB_Model, {freezeTableName: true});
    await table.sync().then(async() => {
      await table.destroy({where:{username: user}});
      resolve(true);
    });

  });
};

//will be used to add a friend after the request from json file was deleted
const addFriend = (host, code, name, chatCode) => {
  console.log(`addFriend ${host}    ${code}   ${name}    ${chatCode}`);
  return new Promise(async(resolve, reject) => {

    const table = await sequelize.define(`CA_friends_${host}`, Friends_TB, {freezeTableName: true});
    await table.sync().then(async() => {
      await table.create({
        username: name,
        usercode: code,
        chatCode: chatCode
      });
      resolve(true);
    })
  });
};


const addConverstaionTB = (firstID, firstName, secondID, secondName) => {//will craete a json file with specific data about this conversation

  console.log(`creating chat TB -- ${firstID} -- ${firstName} -- ${secondID} -- ${secondName}`);

  return new Promise(async (resolve, reject) => {

    const chatNumb = await getCurrentChatcode();
    const userChat = await sequelize.define(`CA_userChat_${chatNumb}`, userChat_TB, {freezeTableName: true});
    userChat.sync();

    resolve(chatNumb);

  })
}


app.post("/findUsers", async (req, res) => {

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

    Users.sync();

    const data = await Users.findAll();
    let users = {};
    data.forEach(user => {
      users[user.dataValues.username] = [user.dataValues.password, user.dataValues.usercode];
    })
    const foundUsers = findClosestMatches(req.body.searchVal, users);

    return res.status(200).json({foundUsers});

})


app.post("/send",async (req, res) => {//body.sender will have the name of sender, and the body.receiver will have both code and name
    console.log("friend request endpoint accesed")

      const ReceiverFR = await sequelize.define(`CA_receivedFriendRequests_${req.body.receiver[1]}`, ReceivedFriendRequests_TB, {freezeTableName: true});
      ReceiverFR.sync().then( async () => {
        await ReceiverFR.findOrCreate({
          where:{username: req.body.sender[0], usercode: req.body.sender[1]},
          defaults:{username: req.body.sender[0], usercode: req.body.sender[1]}})
      });

      const SenderTB = await sequelize.define(`CA_sentFriendRequests_${req.body.sender[1]}`, SentFriendRequests_TB, {freezeTableName: true});
      SenderTB.sync().then( async () => {
        await SenderTB.findOrCreate({
          where:{username: req.body.receiver[0], usercode: req.body.receiver[1]},
          defaults:{username: req.body.receiver[0], usercode: req.body.receiver[1]}})
      });

      return res.sendStatus(200);
})

app.post("/userReceivedRequests", (req, res) => {
    console.log("searching endpoint for available friend requests accesed");

    const FriendRequests = sequelize.define(`CA_receivedFriendRequests_${req.body.usercode}`, ReceivedFriendRequests_TB, {freezeTableName: true});
    FriendRequests.sync().then(async() => {
      const data = await FriendRequests.findAll();
      let returnData ={};
      data.forEach(user => {
        returnData[user.dataValues.username] = user.dataValues.usercode;
      })
      return res.status(200).send({friendRequests: returnData}); 
    }) 

})


app.post("/requestReponse", async (req, res) => {//it will receive the type(accepted/ refused), from(just the name) and to(both the name and code)

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

  const table = sequelize.define(`CA_friends_${req.body.code}`, Friends_TB, {freezeTableName: true});
  table.sync().then(async() => {
    const data = await table.findAll();
    let friends ={};
    data.forEach(ell => {
      friends[ell.dataValues.username] = [ell.dataValues.usercode, ell.dataValues.friendsSince, ell.dataValues.chatCode];
    })
    return res.status(200).send({friends});
  })

})

app.post("/sendMessage", (req, res) => {//req.body.sender[name, code]      req.body.receiver[name, code]   req.body.message{message ... }    req.body.chatNumber

  console.log(`endpoint for sending an message accesed by ${req.body.sender[0]} to ${req.body.receiver[0]}`);

  const table = sequelize.define(`CA_userChat_${req.body.chatNumber}`, userChat_TB, {freezeTableName: true});
  table.sync().then(async() => {
    await table.create({
      message: req.body.message.message,
      byUsername: req.body.sender[0],
      byUsercode: req.body.sender[1]
    })
    return res.sendStatus(200);
  })

  

})

app.post("/getMessages", (req, res) => {
  console.log(`endpoint for getting messages accessed for file ${req.body.chatCode}`);

  if(req.body.index <= 0){//to dont return any messages, beacuse it reached the bottom
    console.log("No messages remaining");
    return res.sendStatus(200);
  } 

  const table = sequelize.define(`CA_userChat_${req.body.chatCode}`, userChat_TB, {freezeTableName: true});

  table.sync().then(async() => {

    let max, min;
    let returnMessages = [];

    if (req.body.index) {//for first request will return last 20 messages, after for every will return 10
      console.log(`index received ${req.body.index}`);
      max = req.body.index;
      min = max - 9;
    } else {
      console.log("no index received, creating one");

      max = await table.findOne({
      order: [
          ['id', 'DESC']
      ],
      limit: 1
      });
      max = max.dataValues.id;

      min = max - 19;
    }

    const messages = await table.findAll({
      where: {
          id: {
              [Sequelize.Op.between]: [min, max]
          }
      }
    });

    messages.forEach(message => {
      console.log(message.dataValues);
      returnMessages.push({message: message.message, by:[message.byUsername, message.byUsercode]});
    })
    returnMessages.reverse();
    console.log(returnMessages)
    return res.status(200).json({messages: returnMessages, lastIndex: min-1});

  })

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

  Servers.sync().then(async() => {

    const data = await Servers.findAll({where:{ownercode: req.body.user[1]}});
    let returnData = {};

    data.forEach(ell => {
      returnData[ell.servercode] = ell.servername;
    })

    return res.status(200).json({servers: returnData});
  })

})

app.post("/createChannel",async (req, res) => {//req.body.code (the code of server) req.body.channel[name, privacy(public/private -- for view), messagePrivacy(if any user can send an message)]
  console.log(`creating a channel for server ${req.body.code}`)

  const channels = await sequelize.define(`CA_ServerChannels_${req.body.code}`, Channels_TB, {freezeTableName: true});
  channels.sync().then(async() => {

    await channels.create({
      access: req.body.channel[1],
      messageAcces: req.body.channel[2],
      name: req.body.channel[0]
    });

    const channelUsers = await sequelize.define(`CA_ChannelUsers_${req.body.channel[0]}_${req.body.code}`, ChannelUsers_TB, {freezeTableName: true});
    await channelUsers.sync().then(async() => {
      await channelUsers.create({
        username: req.body.sender[1],
        usercode: req.body.sender[0],
        messageAccess: true
      });
    });

    const channelMessages = await sequelize.define(`CA_ChannelMessages_${req.body.channel[0]}_${req.body.code}`, ChannelMessages_TB, {freezeTableName: true});
    await channelMessages.sync();

    return res.sendStatus(200);

  })
})


//will return the server`s users to
app.post("/getChannels", async (req, res) => {//req.body.code(server code) req.body.user(so the endpoint will know the accesibility of user and will select what to return)
  console.log(`Requesting channels for the server ${req.body.code}`);

  const channelsTB = await sequelize.define(`CA_ServerChannels_${req.body.code}`, Channels_TB, {freezeTableName: true});
  channelsTB.sync().then(async() => {

    const channels = await channelsTB.findAll();

    Servers.sync().then( async () => {
      const server = await Servers.findOne({where: {servercode: req.body.code}});

      if(server.dataValues.ownercode === req.body.user){
        let returnChannels = {};

        channels.forEach(async channel => {

          const channelUsersTB = await sequelize.define(`CA_ChannelUsers_${channel.dataValues.name}_${req.body.code}`, ChannelUsers_TB, {freezeTableName: true});

          let channelUsers = {};
          let usersMessageAcces = {};
          await channelUsersTB.sync().then(async() => {

            const data = await channelUsersTB.findAll();
            data.forEach(user => {
              channelUsers[user.dataValues.usercode] = user.dataValues.username;
              if(user.dataValues.messageAccess){
                usersMessageAcces[user.dataValues.usercode] = user.dataValues.username;
              }
            })

          })

          returnChannels[channel.dataValues.name] = {
            acces: channel.dataValues.access,
            messageAcces: channel.dataValues.messageAcces,
            users: channelUsers,
            usersMessageAcces
          }

        })

        let users = {};
        const usersTB = await sequelize.define(`CA_ServerUsers_${req.body.code}`, ServerUsers_TB, {freezeTableName:true});
        await usersTB.sync().then(async() => {

          const usersData = await usersTB.findAll();
          usersData.forEach(user => {
            users[user.dataValues.usercode] = user.dataValues.username;
          })

        })

        return res.status(200).json({channels: returnChannels, mainChannel: server.dataValues.mainChannel, users: users});

      }

    })

  })


})

app.post("/changeChannelPrivacySettings", async (req,res) => {//req.body.serverCode   req.body.setting  req.body.channelName 
  
  console.log(req.body.setting + " " +  req.body.channelName)

  if(req.body.setting == "acces"){req.body.setting = "access"};

  const channels = await sequelize.define(`CA_ServerChannels_${req.body.serverCode}`, Channels_TB, {freezeTableName: true});
  await channels.sync().then(async() => {

    let channel = await channels.findOne({where:{name: req.body.channelName}});
    let newValue = channel.dataValues[req.body.setting] === "public" ? "private" : "public";
    
    await channels.update({[req.body.setting] : newValue}, {where:{name: req.body.channelName}});

    return res.sendStatus(200);

  })


})


app.post("/changeMainChannel", async (req, res) => {//req.body.serverCode    req.body.channelName

  console.log(`Changing server main channel to ${req.body.channelName}`)

  await Servers.sync().then(async() => {await Servers.update({mainChannel:req.body.channelName}, {where: {servercode: req.body.serverCode}})});
  return res.sendStatus(200);

})


app.post("/getServerData", (req, res) => {//req.body.serverCode   req.body.userCode

  fs.readFile(`data/servers/${req.body.serverCode}.json`, (err, jsonData) => {
    if(err){return res.status(403).send()}

    let data = JSON.parse(jsonData);
    let returnInfo = {
      users: data.users,
      channels:{},
      mainChannel: data.mainChannel
    }

    Object.entries(data.channels).forEach(([key, value]) => {//will add to the return object just the channels that the users has acces to
      if(value.users[req.body.userCode] || data.owner[1] === req.body.userCode){

        delete value.messages
        returnInfo.channels[key] = {...value};
    
      }
    })

    return res.status(200).send(returnInfo);

  })

})



app.post("/getMessagesServer", (req, res) => {//req.body.serverCode  req.body.channel   req.body.lastIndex

  console.log("requesting server messages")

  fs.readFile(`data/servers/${req.body.serverCode}.json`, (err, jsonData) => {
    if(err){return res.status(400).send()}

    console.log(req.body)
    let data = JSON.parse(jsonData)

    if(data.channels[req.body.channel].messages && !Object.keys(data.channels[req.body.channel].messages).length === 0){return res.status(200).send("no messages")}

    let max, min;

    if(req.body.lastIndex){//first time will return 20 messages then 10
      max = req.body.lastIndex--;
      min = req.body.lastIndex - 9;
    }else{
      max = Object.keys(data.channels[req.body.channel].messages).length;
      min = max - 19;
    }

    let messageKeys = Object.keys(data.channels[req.body.channel].messages);
    let messageValues = Object.values(data.channels[req.body.channel].messages);
    let returnMesages = {messages: [], lastIndex: min};

    for(let i = min; i < max; i++){
      if(i >= 0){
        returnMesages.messages.push(messageValues[i]);
      }
    }

    console.log(returnMesages)
    return res.status(200).send(returnMesages);

  })

})





app.post("/sendMessageServer", (req, res) => {//req.body.serverCode      req.body.channel        req.body.by   req.body.message

  fs.readFile(`data/servers/${req.body.serverCode}.json`, (err, jsonData) => {
    if(err){return res.status(400).send()}
    
    let data = JSON.parse(jsonData);
    console.log(req.body)
    data.channels[req.body.channel].messages[Object.keys(data.channels[req.body.channel].messages).length] = [req.body.message, req.body.by];

    fs.writeFile(`data/servers/${req.body.serverCode}.json`, JSON.stringify(data), err => {
      if(err){return res.status(400).send(200)}

      return res.status(200).send();
    })

  })

})


















//SETTINGS

app.post("/createServer",async (req, res) => {
  console.log("Creating a server");

  const serverCode = await getCurrentServercode();
  const serversTB = sequelize.define(`Servers`, Servers_TB, {freezeTableName: true});
  await serversTB.sync().then(async() => {
  
    await serversTB.create({
      servername: req.body.serverName,
      servercode: serverCode,
      description: req.body.description,
      ownername: req.body.owner[0],
      ownercode: req.body.owner[1]
    });

    const joinRequests = await sequelize.define(`CA_ServerJoinRequests_${serverCode}`, JoinRequestsServer_TB, {freezeTableName: true});
    await joinRequests.sync();

    const channels = await sequelize.define(`CA_ServerChannels_${serverCode}`, Channels_TB, {freezeTableName: true});
    await channels.sync();

    const serverUsers = await sequelize.define(`CA_ServerUsers_${serverCode}`, ServerUsers_TB, {freezeTableName: true});
    await serverUsers.sync().then(async() => {
      await serverUsers.create({
        username: req.body.owner[0],
        usercode: req.body.owner[1]
      })
    });

    const userOwnServersTB = await sequelize.define(`CA_ownServers_${req.body.owner[1]}`, OwnedServers_TB, {freezeTableName: true});
    await userOwnServersTB.sync().then(async() => {

      await userOwnServersTB.create({
        servername: req.body.serverName,
        servercode: serverCode
      });

      const memberInServers = await sequelize.define(`CA_memberInServers_${req.body.owner[1]}`, MemberInServers_TB, {freezeTableName: true});
      memberInServers.sync().then(async() => {

        await memberInServers.create({
          servername: req.body.serverName,
          servercode: serverCode
        });

        return res.sendStatus(200);

      })

    })

  });

});



app.post("/getServerBasicInfo",async (req, res) => { //this endpoint will return some basic info about the server for a possible join request

  const servers = await sequelize.define(`Servers`, Servers_TB, {freezeTableName: true});
  servers.sync().then(async() => {
    const serverData = await servers.findAll({where: {servercode: req.body.code}});
    return res.status(200).json({server:{serverName: serverData[0].dataValues.servername, serverCode: serverData[0].dataValues.servercode}});
  });

})

app.post("/sendServerJoinRequest", async (req, res) => {//req.body.serverCode  req.body.sender[code, name]

  const JoinRequest = await sequelize.define(`CA_ServerJoinRequests_${req.body.serverCode}`, JoinRequestsServer_TB, {freezeTableName: true});
  JoinRequest.sync().then(() => {

    JoinRequest.create({
      username: req.body.sender[1],
      usercode: req.body.sender[0]
    })

    return res.sendStatus(200);
  })

})


app.post("/sendServerJoinRequestResponse", async (req, res) => {//req.body.response(true/false)  req.body.userCode req.body.serverCode

  const requests = await sequelize.define(`CA_ServerJoinRequests_${req.body.serverCode}`, JoinRequestsServer_TB, {freezeTableName: true});
  requests.sync().then(async() => {

    let user = await requests.findOne({where: {usercode: req.body.userCode}});

    Servers.sync().then(async() => {

      let server = await Servers.findOne({where: {servercode: req.body.serverCode}});
      server = server.dataValues;

      await user.destroy();

      if(req.body.response){

        const memberInServers = await sequelize.define(`CA_memberInServers_${req.body.userCode}`, MemberInServers_TB, {freezeTableName: true});
        memberInServers.sync().then(async() => {

          await memberInServers.create({servername: server.servername, servercode: server.servercode});

          const serverUsers = await sequelize.define(`CA_ServerUsers_${req.body.serverCode}`, ServerUsers_TB, {freezeTableName: true});
          serverUsers.sync().then(async() => {

            await serverUsers.create({username: user.dataValues.username, usercode: user.dataValues.usercode});

            return res.status(200).json({response: "request accepted"});

          })

        })

      }else{ return res.status(200).json({response: "request declined"})}

    })
    


  });

})


app.post("/getGlobalServerSettings", async (req, res) => {//req.body.serverCode 

  const usersTB = await sequelize.define(`CA_ServerUsers_${req.body.serverCode}`, ServerUsers_TB, {freezeTableName: true});
  await usersTB.sync().then(async() => {

    let usersData = await usersTB.findAll();
    let users = {};

    usersData.forEach(user => {
      users[user.dataValues.usercode] = user.dataValues.username;
    })

    const joinRequestsTB = await sequelize.define(`CA_ServerJoinRequests_${req.body.serverCode}`, JoinRequestsServer_TB, {freezeTableName: true});
    await joinRequestsTB.sync().then(async() => {

      const joinData = await joinRequestsTB.findAll();
      let joinRequests = {};

      joinData.forEach(data => {
        joinRequests[data.dataValues.usercode] = data.dataValues.username;
      })

      return res.status(200).json({users, joinRequests});

    })

  })

})


app.post("/eliminateUserFromServer", async (req, res) => {//req.body.serverCode  req.body.userCode

  const serverUsers = await sequelize.define(`CA_ServerUsers_${req.body.serverCode}`, ServerUsers_TB, {freezeTableName: true});
  await serverUsers.sync().then(async() => {

    let data = await serverUsers.findOne({where: {usercode: req.body.userCode}});
    console.log(data);
    await data.destroy();

    const memberInServers = await sequelize.define(`CA_memberInServers_${req.body.userCode}`, MemberInServers_TB, {freezeTableName :true});
    await memberInServers.sync().then(async() => {

      data = await memberInServers.findOne({where:{servercode: req.body.serverCode}});
      console.log(data);
      await data.destroy();

      const channelsTB = await sequelize.define(`CA_ServerChannels_${req.body.serverCode}`, Channels_TB, {freezeTableName: true});
      await channelsTB.sync().then(async() => {

        data = await channelsTB.findAll();
        console.log(data);
        data.forEach(async channel => {

          channel = channel.dataValues.name;
          let table = await sequelize.define(`CA_ChannelUsers_${channel}_${req.body.serverCode}`, ChannelUsers_TB, {freezeTableName: true});
          await table.sync().then(async() => {

            let user = await table.findOne({where:{usercode: req.body.userCode}});
            console.log(user)
            await user.destroy();

          })
          return res.status(200).json({response: "user eliminated from server data"});

        })

      })

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


app.post("/changeUserAccesiblityChannel", async (req, res) => {//req.body.serverCode  req.body.channel  req.body.user[code, name]

  const channelUsers = sequelize.define(`CA_ChannelUsers_${req.body.channel}_${req.body.serverCode}`, ChannelUsers_TB, {freezeTableName: true});
  await channelUsers.sync().then(async() => {

    const user = await channelUsers.findOne({where: {usercode: req.body.user[0]}});

    if(user?.dataValues){
      await user.destroy();
      return res.status(200).json({response: "user access removed from the channel"});
    }else{
      await channelUsers.create({username: req.body.user[1], usercode: req.body.user[0]});
      return res.status(200).json({response: "user access added to the server"});
    }

  })

})


app.post("/changeUserMessageAcces",async(req, res) => {//req.body.serverCode  req.body.channel  req.body.user[code, name]

  const channelUsers = sequelize.define(`CA_ChannelUsers_${req.body.channel}_${req.body.serverCode}`, ChannelUsers_TB, {freezeTableName: true});
  await channelUsers.sync().then(async() => {

    const user = await channelUsers.findOne({where: {usercode: req.body.user[0]}});

    if(user.dataValues.messageAccess){
      await user.update({messageAccess: false, where:{usercode: req.body.user[0]}});
      return res.status(200).json({response: "messageAccess removed from the channel"});
    }else{
      await user.update({messageAccess: true, where:{usercode: req.body.user[0]}});
      return res.status(200).json({response: "messageAccess added to the channel"});
    }

  })

})







  
    





































































app.listen(port, () => {
  console.log("Local server is running, time to chat :)")
})
