//https://ro.jooble.org/desc/-4029074834890132952?ckey=internship-web-developer&rgn=8733&pos=4&elckey=-506711421853024733&p=1&sid=4087418186405391502&jobAge=306&relb=115&brelb=115&bscr=29397.022204632623&scr=29397.022204632623&searchTestGroup=1_2_1&iid=2586823936861905699
import "../data/users"

const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/addAcc', (req, res) => {//req is the request sent to the server and in req in th post obj
  //the template object for the user
  

  res.send(`Data for new account received successfully ${req.body.userName}, ${req.body.password}`);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});