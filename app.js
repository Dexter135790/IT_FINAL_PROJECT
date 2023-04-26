const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const app = express()


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

//Connceting the mongo database
mongoose.connect('mongodb+srv://admin:admin@cluster0.ge9bpaw.mongodb.net/jobSearch', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

var session=0;
var email = "";
var unsuccessful=0;


// Taksers schema for their details
const taskersSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    contactNumber: Number,
    city: String,
    password: String,
    resume: Buffer,
    skills: String,
    description: String
});

const companiesSchema = new mongoose.Schema({
    companyName: String,
    email: String,
    contactNumber: Number,
    industry: String,
    companyAddress: String,
    password: String
});

const jobsSchema = new mongoose.Schema({
    job: String,
    description: String,
    salary: String,
    qualifications: String,
    link: String
})


const Tasker = mongoose.model("Tasker", taskersSchema);

const Company = mongoose.model("Company", companiesSchema);

const Job = mongoose.model("Job", jobsSchema);


app.get("/", (req, res)=>{
    res.render("main", {
        style: "style/main.css",
        session: session
    });
});

app.get("/login", (req, res)=>{
    res.render("login", {
        style: "style/login.css",
        session: session,
        unsuccessful: unsuccessful
    });
});

app.post("/login", (req, res)=>{
    console.log(req.body.option);
    if(req.body.option == "Tasker"){
        session=1;
        const username = req.body.uname;
        const password = req.body.pswd;

        Tasker.findOne({email: username})
        .then((foundUser)=>{
            
            if(foundUser.password === password){
                unsuccessful=0;
                email = foundUser.email;
                res.redirect("/taskersdash");
            }
        })
        .catch((err)=>{
            console.log(err);
            unsuccessful=1;
            res.render("login", {
                style: "style/login.css",
                session: session,
                unsuccessful: unsuccessful
            });
        });
    }else{
        
            session=2;
            const username = req.body.uname;
            const password = req.body.pswd;
    
            Company.findOne({email: username})
            .then((foundUser)=>{
                if(foundUser.password === password){
                    unsuccessful=0;
                    email = foundUser.email;
                    res.redirect("/companydash");
                }
            })
            .catch((err)=>{
                console.log(err);
            unsuccessful=1;
            res.render("login", {
                style: "style/login.css",
                session: session,
                unsuccessful: unsuccessful
            });
        });
}

});

app.get("/compReg", (req, res)=>{
    res.render("companyreg", {
        style: "style/compreg.css",
        session: session
    });
});

app.post("/compReg", (req, res)=>{

    const company = new Company({
        companyName: req.body.name,
        email: req.body.email,
        contactNumber: req.body.contact,
        industry: req.body.industry,
        companyAddress: req.body.address,
        password: req.body.pswd
    });

    company.save();

    res.redirect("/login");
})

app.get("/taskerReg", (req, res)=>{
    res.render("taskerreg", {
        style: "style/taskreg.css",
        session: session
    });
});

app.post("/taskerReg", (req, res)=>{

        console.log("Storing the data");
        const tasker = new Tasker({
            firstName: req.body.fname,
            lastName: req.body.lname,
            email: req.body.email,
            contactNumber: req.body.contactNumber,
            city: req.body.city,
            password: req.body.pswd,
            resume: req.body.resume,
            skills: req.body.skill,
            description: req.body.description
        });

        tasker.save();

        res.redirect("/login");
    
})

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
    Tasker.findOne({email: email})
        .then((foundUser)=>{
            res.render("taskerdash", {
                style: "style/taskerdash.css",
                session: k,
                fname: foundUser.firstName,
                lname: foundUser.lastName,
                email: foundUser.email,
                number: foundUser.contactNumber,
                city: foundUser.city,
                skills: foundUser.skills,
                description: foundUser.description
            });
        })
        .catch((err)=>console.log(err))
    
});

app.get("/companydash", (req, res)=>{
    Company.findOne({email: email})
        .then((foundUser)=>{
            res.render("companydash", {
                style: "style/taskerdash.css",
                session: 2,
                name: foundUser.companyName,
                email: foundUser.email,
                number: foundUser.contactNumber,
                industry: foundUser.industry,
                address: foundUser.companyAddress,
            });
        })
        .catch((err)=>console.log(err))
})

app.get("/jobPostForm", (req, res)=>{
    console.log(session);
    res.render("jobPostForm", {
        style: "style/taskreg.css",
        session: session
    });
})

app.post("/jobPostForm", (req, res)=>{
    const job = new Job({
        job: req.body.Job,
        description: req.body.description,
        salary: req.body.job_pay,
        qualifications: req.body.qualifications,
        link: req.body.link
    });

    job.save();

    res.redirect("/jobs");

});

app.get("/jobs", (req, res)=>{

    // Job.find({}).toArray((err, data) => {
    // if (err) throw err;

    // res.render('jobs', { data: data });
    // });

    Job.find({})
    .then((foundUser)=>{
        res.render("jobs", {data: foundUser, style: "style/jobs.css", session: session});
    })
    .catch((err)=>console.log(err));
});

app.listen(3001, ()=>{
    console.log('Server started on port 3000');
});