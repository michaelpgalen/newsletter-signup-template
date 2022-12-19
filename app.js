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
   
    const url = "https://us8.api.mailchimp.com/3.0/lists/d51dba7d9c";
    const options = {
        method: 'POST',
        auth: "michaelpgalen:0e9862d0ec237354a6b7e286f7178a4d-us8"
    }

    const request = https.request(url, options, function(response){
        // response.on('data', function(data){
        //     console.log(JSON.parse(data))
        // })

        console.log('status code: ' + response.statusCode)
        // console.log('Response headers: ' + response.headers)

        // response.on('error', function(error){
        //     console.log("Error in Mailchimp response: " + error)
        // })

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


app.listen(3000, console.log("Server running on port 3000"));

// Mailchimp api key
// 0e9862d0ec237354a6b7e286f7178a4d-us8
// audience ID: d51dba7d9c