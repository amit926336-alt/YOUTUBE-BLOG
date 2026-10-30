require('dotenv').config()

const express=require("express")
const path=require("path")
const mongoose=require("mongoose")


const userRoute=require("./routes/user")
const blogRoute=require("./routes/blog")
const cookieParser=require("cookie-parser")
const Blog=require("./models/blog")
const { checkForAuthenticationCookie } = require("./middleware/authentication");

const app=express()
// const PORT=8003
const PORT=process.env.PORT || 8003

// mongoose.connect("mongodb://127.0.0.1:27017/blogify")
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MONOGO DB CONNECTED"))
.catch((err)=>console.log("error",err))

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.static(path.resolve('./Public')))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/",async(req,res)=>{
    const allBlogs=await Blog.find({})
    return res.render("home",{
        user:req.user,
        blogs:allBlogs
    })
})
app.use("/user",userRoute)
app.use("/blog",blogRoute)

app.listen(PORT,"0.0.0.0",()=>console.log(`server started on port ${PORT}`));

