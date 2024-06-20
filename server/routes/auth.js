const express = require("express");
const {
  register,
  login,
  currentuser,
  profileupdate,
  findpeople,
  following,
  addfollower,
  followingpage,
  removefollower,
  unfollowing,
  conversation,
  conversationload,
  messageload,
  message,
  allusers,
} = require("../controllers/auth");
const requiresignin = require("../middleware/index");
const {
  createpost,
  uploadimage,
  postbyuser,
  likepost,
  unlikepost,
  commentbyuser,
  uncommentbyuser,
} = require("../controllers/post");

const formidable = require("express-formidable");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getcurrentuser", requiresignin, currentuser);
router.post("/createpost", requiresignin, createpost);
router.post("/uploadimage", requiresignin, formidable(), uploadimage);
router.get("/userposts", requiresignin, postbyuser);

router.put("/likepost", requiresignin, likepost);
router.put("/unlikepost", requiresignin, unlikepost);

router.put("/addcomment", requiresignin, commentbyuser);
router.put("/removecomment", requiresignin, uncommentbyuser);

router.put("/profileupdate", requiresignin, profileupdate);

router.get("/findpeople", requiresignin, findpeople);

router.put("/following", requiresignin, addfollower, following);

router.get("/followingpage", requiresignin, followingpage);

router.put("/unfollowing", requiresignin, removefollower, unfollowing);

router.post("/conversation",requiresignin, conversation);
router.get("/conversation/:userid", requiresignin,conversationload);

router.post("/message",requiresignin, message);
router.get("/message/:conversationid",requiresignin, messageload);

router.get("/users",requiresignin,allusers)

module.exports = router;
