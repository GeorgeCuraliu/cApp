const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());



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

    fs.readFile(`src/data/users/${code}.json`, (err, jsonData) => {

      if (err) {
        console.log(err);
        reject(err);
      }

      let data = JSON.parse(jsonData);
      console.log(`${data[type][user]} code request will be deleted -- ${code} -- ${type} -- ${user}`);
      delete data[type][user];

      fs.writeFile(`src/data/users/${code}.json`, JSON.stringify(data), err => {

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
    fs.readFile(`src/data/users/${host}.json`, (err, jsonData) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      console.log(`reading the data of the user -- ${host} -- add friend`)
      try {
        let data = JSON.parse(jsonData);
        data.friends[name] = [code, new Date(), chatCode];//new date will determine since when this 2 users are friends

        fs.writeFile(`src/data/users/${host}.json`, JSON.stringify(data), err => {
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

  fs.readFile("src/data/MB9DATA.json", (err, jsonData) => {
    if(err){
      console.log(err);
      reject(err);
    }

    let data = JSON.parse(jsonData);
    let fileNumb = data.currentChatFileNumber;
    data.currentChatFileNumber ++;

    fs.writeFile("src/data/MB9DATA.json", JSON.stringify(data), (err) => {
      if(err){
        console.log(err);
        reject(err);
      }
    });

    fs.writeFile(`src/data/chats/${fileNumb}.json`, JSON.stringify(chatData), (err) => {
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

    fs.readFile("src/data/MB9DATA.json", (err, jsonData) => {
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

    

      fs.readFile(`src/data/users/${req.body.receiver[1]}.json`, (err, jsonData) => {//receiver[1] will have the reciver code
          if (err) {
              return res.status(500).send("Error adding request data");
          }

          let reqData = JSON.parse(jsonData);
          reqData.receivedFriendRequest[req.body.sender[0]] = sender;

          fs.writeFile(`src/data/users/${req.body.receiver[1]}.json`, JSON.stringify(reqData), err => {
              if (err) {
                  return res.status(500).send("Error adding request data");
              }

                //now add data to the sender
              fs.readFile(`src/data/users/${sender}.json`, (err, jsonData) => {
                  if (err) {
                      return res.status(500).send("Error adding request data");
                  }
                    
                  let senderData = JSON.parse(jsonData);
                  senderData.sentFriendRequest[req.body.receiver[0]] = req.body.receiver[1];

                  fs.writeFile(`src/data/users/${sender}.json`, JSON.stringify(senderData), err => {
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

    fs.readFile("src/data/MB9DATA.json", (err, jsonData) => {
        if (err) {
            return res.status(500).send("Error reading the data");
        }

        let userCode = JSON.parse(jsonData).users[req.body.userName][1];

        fs.readFile(`src/data/users/${userCode}.json`, (err, jsonData) => {
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


app.listen(port, () => {
    console.log(`friend request port is open on http://localhost:${port} --- process ID -- ${process.pid}`);
});