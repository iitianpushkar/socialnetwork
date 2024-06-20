const express = require("express");
const Post = require("../models/posts");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret,
});

const createpost = (req, res) => {
  const { content, image } = req.body;
  if (!content.length) {
    res.json({
      error: "content is required",
    });
  }
  try {
    const post = new Post({ content, image, postedBy: req.auth._id });
    post.save();
    res.json(post);
  } catch (error) {
    console.log("error while creating post in server=>", error);
  }
};

const uploadimage = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files.images.path);
  console.log(result);
  res.json({
    url: result.secure_url,
    public_id: result.public_id,
  });
};

const postbyuser = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name image")
      .sort({ createBy: -1 })
      .limit(10);

    res.json(posts);
  } catch (error) {
    console.log(error);
  }
};

const likepost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.body._id, {
      $addToSet: { like: req.auth._id },
      new: true,
    });

    res.json(post);
  } catch (error) {
    console.log("like error from server:", error);
  }
};

const unlikepost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.body._id, {
      $pull: { like: req.auth._id },
      new: true,
    });

    res.json(post);
  } catch (error) {
    console.log("unlike error from server:", error);
  }
};

const commentbyuser = async (req, res) => {
  try {
    const { postid, comment } = req.body;
    const post = await Post.findByIdAndUpdate(postid, {
      $push:{comment:{text:comment,postedBy:req.auth._id}}},{new:true}
    ).populate("comment.postedBy","_id name image")
    res.json(post)
  } catch (error) {console.log(error)}
};

const uncommentbyuser = async (req, res) => {
      try {
        const { postid, comment } = req.body;
        const post = await Post.findByIdAndUpdate(postid, {
          $pull:{comment:{_id:comment._id}}},{new:true}
        ).populate("comment.postedBy","_id name image")
        res.json(post)
      } catch (error) {console.log(error)}
    };

module.exports = { createpost, uploadimage, postbyuser, likepost, unlikepost,commentbyuser,uncommentbyuser};
