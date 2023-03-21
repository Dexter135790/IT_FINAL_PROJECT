const express = require('express')
const bodyParser = require('body-parser')

const app = express()


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

var session=0;

app.get("/", (req, res)=>{
    res.render("main", {
        style: "style/main.css",
        session: session
    });
});

app.get("/login", (req, res)=>{
    res.render("login", {
        style: "style/login.css",
        session: session
    });
});

app.get("/compReg", (req, res)=>{
    res.render("companyreg", {
        style: "style/compreg.css",
        session: session
    });
});

app.get("/taskerReg", (req, res)=>{
    res.render("taskerreg", {
        style: "style/taskreg.css",
        session: session
    });
});

app.get("/privacy", (req, res)=>{
    res.render("privacy", {
        style: "style/privacy.css",
        session: session
    });
});

app.get("/about", (req, res)=>{

});

app.get("/jobsearch", (req, res)=>{
    res.render("jobsearch", {
        style: "style/jobsearch.css",
        session: session
    });
});

app.get("/taskersdash", (req, res)=>{
    let k=1;
    res.render("taskerdash", {
        style: "style/taskerdash.css",
        session: k
    });
});





app.listen(3001, ()=>{
    console.log('Server started on port 3000');
});