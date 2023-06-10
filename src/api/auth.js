const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());




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
    "receivedFriendRequest": {}
  };

  //acces the app data and get the user order number
  fs.readFile('src/data/MB9DATA.json', 'utf8', (err, data) => {
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
    fs.writeFile(`src/data/users/${number}.json`, userJsonData, (err) => {
      if (err) {
        console.log(err);
        return res.send([812, "A server error occurred while creating the user data, please try again later"]);
      }

      jsonData.currentUserOrder += 1; // increase the number order;

      //now update the server data json file with the new values
      fs.writeFile('src/data/MB9DATA.json', JSON.stringify(jsonData), (err) => {
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
  fs.readFile("src/data/MB9DATA.json", (err, jsonData) => {
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



app.listen(port, () => {
  console.log(`authentification port is open on on http://localhost:${port} --- process ID -- ${process.pid}`);
});