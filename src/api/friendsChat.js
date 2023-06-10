const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3091;

app.use(cors());
app.use(express.json());

app.post("/getFriends", (req, res) => {

    if(!req.body.code){return res.send(false)}

    console.log(`friends data request from ${req.body.code}`)

    fs.readFile(`src/data/users/${req.body.code}.json`, (err, jsonData) => {
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

  fs.readFile(`src/data/chats/${req.body.chatNumber}.json`, (err, Jdata) => {

      if(err){
        console.error(err);
        return res.send("Couldnt acces chat data")
      }

      let data = JSON.parse(Jdata);
      let messageIndex = data.lastMessageNumber;//retrieve the index of this message
      data.lastMessageNumber++;
      const message = {
        message: req.body.message.message,
        by: req.body.sender
      }

      data.messages[messageIndex] = message;

      fs.writeFile(`src/data/chats/${req.body.chatNumber}.json`, JSON.stringify(data), (err) => {
        console.log(err)
      });

      return res.send("Message sent without any error")

  })

})

app.listen(port, () => {
    console.log(`friends chat port is open on on http://localhost:${port} --- process ID -- ${process.pid}`);
  });