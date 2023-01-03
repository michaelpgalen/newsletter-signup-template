const express = require('express');
const https = require('https');

const app = express();
app.use(express.static("public"));
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const postData = {
        members: [
            {
                email_address: email,
                status:"subscribed",
                merge_fields: {
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    }
    const jsonPostData = JSON.stringify(postData);

    console.log(req.body)
   
    const url = "https://us8.api.mailchimp.com/3.0/lists/YOUR_LIST_ID";
    const options = {
        method: 'POST',
        auth: "YOUR-API-KEY"
    }

    const request = https.request(url, options, function(response){
        console.log('status code: ' + response.statusCode)

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
    })
    request.write(jsonPostData)
    request.end()

})

app.post("/failure", function(req,res){
    res.redirect("/")
})


app.listen(process.env.PORT || 3000, console.log("Server running"));