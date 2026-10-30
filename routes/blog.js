const express=require("express")
const router=express.Router()
const multer=require("multer")
const path=require("path")
const Blog=require("../models/blog")
const Comment=require("../models/comment")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,path.resolve("./Public/uploads"))
  },
  filename:function(req,file,cb){
  const filename=`${Date.now()}-${file.originalname}`;
  cb(null,filename);
  }   
})

const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{
        user:req.user,
    });
})
router.get("/:id",async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("CreatedBy");
    const Comments=await Comment.find({blogID:req.params.id}).populate(
    'CreatedBy');
    return res.render("blog",{
        user:req.user,
        blog,
        Comments
    })
})
router.post("/",upload.single('CoverImageUrl'),async(req,res)=>{
    // console.log(req.body)
    // console.log(req.file)
    const {title,body}=req.body;
    const blog=await Blog.create({
        body,
        title,
        CreatedBy:req.user._id,
        CoverImageUrl:`/uploads/${req.file.filename}`,
    })
    return res.redirect(`/blog/${blog._id}`)
});
router.post("/comment/:blogID",async(req,res)=>{
    await Comment.create({
        content:req.body.content,
        blogID:req.params.blogID,
        CreatedBy:req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogID}`);
})
module.exports=router