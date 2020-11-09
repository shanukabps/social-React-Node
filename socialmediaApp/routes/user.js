const express = require("express");
const { User} = require("../models/user");
const _ = require("lodash");
const {Post}  = require("../models/post");

const autherizations = require("../middlewares/authorization");
const router = express.Router();


router.get("/user/:_id",autherizations, async (req, res) => {
   // console.log(req.params._id)
  await User.findOne({_id:req.params._id})
    .sort({ title: -1 })
.select("-password")
    .then((user) => {
// console.log('user',user)
  Post.find({postedBy:req.params._id})
 .populate("postedBy","_id name")
 .exec((err,posts)=>{
if(err){
    //console.log(err)
    return res.status(422).json({error:err})
}
//console.log('posts',{user,posts})
res.json({user,posts})
 })
    }).catch(error=>{
           console.log(error.message)
    return res.status(404).json({err:error})
 })
})





router.put("/unfollow", autherizations, async (req, res) => {
 // console.log(req.body);
  User.findByIdAndUpdate({ _id: req.body.followId },
    {$pull: { followers: req.user._id }},
    {
      new: true,
    },(err,result)=>{
if(err){
    return res.status(422).json({error:err})
}
 User.findByIdAndUpdate({ _id: req.user._id },

    {$pull: { following: req.body.followId }},
    {
       new: true  
    }).then(result=>{ 
        res.json(result)
    }).catch(err=>{console.log(err.message)
    return res.status(422).json({error:err})
    })

   
}).catch(err=>{console.log(err.message)
    return res.status(422).json({error:err})
    
})
});
















router.put("/follow", autherizations, async (req, res) => {
 // console.log(req.body);
  User.findByIdAndUpdate({ _id: req.body.followId },
    {$push: { followers: req.user._id }},
    {
      new: true,
    },(err,resu)=>{
if(err){
    return res.status(422).json({error:err})
}
 User.findByIdAndUpdate({ _id: req.user._id },

    {$push: { following: req.body.followId }},
    {
       new: true  
    }).select("-password").then(result=>{ 
        res.json(result)
    }).catch(err=>{console.log(err.message)
    return res.status(422).json({error:err})
    })
//console.log(resu.followers.length)
   
}).catch(err=>{console.log(err.message)
    return res.status(422).json({error:err})
    
})
});



router.put('/updatepic',autherizations,(req,res)=>{
    console.log(req.body)
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},(err,result)=>{

        if(err){
            console.log(err)
            return res.status(422).json({error:"Picture Can Not Post"})
    
        }
        res.json(result)


    }).catch(err=>{console.log(err.message)
    return res.status(422).json({error:err})
    })
})







module.exports = router



