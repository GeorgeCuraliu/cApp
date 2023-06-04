const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

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


app.post("/send", (req, res) => {//body.sender will have the name of sender, and the body.receiver will have both code and name
    console.log("friend request endpoint accesed")
    //retrieve the code of sender from MB9DATA.json
    fs.readFile("src/data/MB9DATA.json", (err, jsonData) => {
        if (err) {
            return res.status(500).send("Error reading file");
        }
        let sender = JSON.parse(jsonData).users[req.body.sender][1];
        console.log(`${sender}  sender code received`)
        //now add the received request to user data

        fs.readFile(`src/data/users/${req.body.receiver[1]}.json`, (err, jsonData) => {//receiver[1] will have the reciver code
            if (err) {
                return res.status(500).send("Error adding request data");
            }

            let reqData = JSON.parse(jsonData);
            reqData.receivedFriendRequest[req.body.sender] = sender;

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

})

app.post("/userReceivedRequests", (req, res) => {
    console.log("endpoint for searchinf for available friend requests accesed");

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


app.listen(port, () => {
    console.log(`friend request port is open on http://localhost:${port}`);
});