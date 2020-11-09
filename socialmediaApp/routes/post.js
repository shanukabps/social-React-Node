const express = require("express");
const { Post, validatePost } = require("../models/post");
const _ = require("lodash");

const autherizations = require("../middlewares/authorization");

const router = express.Router();

router.get("/allpost", async (req, res) => {
  await Post.find()
    .sort({ title: -1 })
    .populate("postedBy", "_id name email")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log("Error", err.message);
    });
});

router.post("/createpost", autherizations, async (req, res) => {
  //  console.log('post awa', req.body)
  const { title, body, photo } = req.body;

  const { error } = await validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);

//  console.log(req.user);

  const post = new Post({
    title,
    body,
    photo,
    postedBy: req.user,
  });
  await post
    .save()
    .then((post) => {
      res.json({ post: post });
    })
    .catch((err) => console.log("err in post save", err.message));
});

router.get("/mypost", autherizations, async (req, res) => {
  await Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((err) => {
      console.log("Error", err.message);
    });
});

router.put("/like", autherizations, async (req, res) => {
 // console.log(req.user._id);
  Post.findByIdAndUpdate(
    { _id: req.body.postId },
    {
      $push: { like: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("like.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/unlike", autherizations, async (req, res) => {
 // console.log(req.body);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { like: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("like.postedBy", "_id name")
    .populate("postedBy", "_id name")

    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});


router.put('/comments',autherizations,(req,res)=>{
console.log(req.body)

    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',autherizations,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})





// router.put("/deletecomment", autherizations, async (req, res) => {
//   console.log(req.body);
//   Post.findByIdAndUpdate(
//     req.body.postid,
//     {
//       $set: { comments: req.body.commentid },
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("comments.postedBy", "_id name")
//     .populate("postedBy", "_id name")

//     .exec((err, result) => {
//         console.log(result)
//       if (err) {
//         return res.status(422).json({ error: err });
//       } else {
//         res.json(result);
//       }
//     })
// });







// router.delete("/deletecomment/", autherizations, (req, res) => {
//  console.log('body',req.body)
  
//     Post.findOne({ _id: req.body.postid })
//     .populate("postedBy", "_id")
//     .exec((err, post) => {
//      console.log(post)
//     //   console.log( post.postedBy._id.toString())
//     //   console.log( req.user._id)
//     //   console.log(post.postedBy._id.toString() === req.user._id.toString())
//       if (err || !post) {
//         return res.status(422).json({ error: err });
//       } else if (post.postedBy._id.toString() === req.user._id.toString()) {
//        post.findOne({_id: req.body.commentid})
//          .exec((errn, c) => {
// console.log(c)
// console.log(errn)
//          })

        

//         // post.remove().then((result) => {
//         //   res.json(result);
//         // });
//       } else {
//         res.json({ message: "Error On Delete" });
//       }
//     });
// });


router.get("/getsubfollowpost",autherizations, async (req, res) => {
// console.log(req.user.following)
 
  await Post.find({postedBy:{$in:req.user.following}})
    .sort({ title: -1 })
    .populate("postedBy", "_id name email")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log("Error", err.message);
    });
});



module.exports = router;
