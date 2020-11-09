const Joi = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    like: [
        {
            type: ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            text: String,
            postedBy: {
                type: ObjectId,
                ref: "User",
            },
        },
    ],
    postedBy: {
        type: ObjectId,
        ref: "User",
    },
});

function validatePost(post) {
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        body: Joi.string().required(),
        photo: Joi.string().required(),
    });

    return schema.validate(post);
}

const Post = mongoose.model("Post", postSchema);

exports.Post = Post;

exports.validatePost = validatePost;
