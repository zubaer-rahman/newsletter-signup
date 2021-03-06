const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signUp.html");
})

app.post("/", (req, res) => {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName);

  const data = {
    members: [
     {
       email_address: email,
       status: "subscribed",
       merge_fields: {
         FNAME: firstName,
         LNAME: lastName
       }
     }
   ]
 };
 const jsonData = JSON.stringify(data);
 const list_id = "33e474a7db";
 const API_SERVER = "us14";
 const API_KEY = "6932c020a7fa60101d2aef63413d82e2-us14";
 const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${list_id}`;

 const options = {
   method: "POST",
   auth: `zubu:${API_KEY}`
 };

 const request = https.request(url, options, (response) => {

   if(response.statusCode === 200) {
     res.sendFile(__dirname + "/success.html");
   }
   else res.sendFile(__dirname + "/failure.html");

   response.on("data", (data) => {
     console.log(JSON.parse(data));
   });
 });

 request.write(jsonData);
 request.end();

});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port: 3000");
});
