const express = require("express");
const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const Conversations = require("../models/conversations");
const Messages = require("../models/messages");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  // validation
  if (!name) return res.status(400).send("Name is Required");
  if (!password || password.length < 6)
    return res.status(400).send("Password should be 6 charectors long");

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).send("Email already exist"); // send msg if email already exist

  // hashed
  const hash = await hashPassword(password);

  const user = new User({
    name,
    email,
    password: hash,
    username: nanoid(6),
  });
  try {
    await user.save();
    console.log("REGISTERD USER =>", user);
    return res.json({ ok: true });
  } catch (error) {
    console.log("REGISTERED FAILED =>", error);
    return res.status(400).send("Error, Try again");
  }
};

// for login
const login = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    //*Check if our database has user with that username
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("user Does not exist");

    //check password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Incorrect Password");

    // create a jwt token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    }); // to create sign token

    // we are not saving user password and secret
    user.password = undefined;
    user.secret = undefined;

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log("ERROR WHILE LOGIN =>", err);
    return res.status(400).send("Error, Try again");
  }
};

// to verify the token

const currentuser = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    if (user) {
      res.json({ ok: true });
    }
  } catch (err) {
    console.log("error while verifying token:", err);
  }
};

const profileupdate = async (req, res) => {
  try {
    const data = {};
    if (req.body.username) {
      data.username = req.body.username;
    }
    if (req.body.name) {
      data.name = req.body.name;
    }
    if (req.body.about) {
      data.about = req.body.about;
    }
    if (req.body.password) {
      if (req.body.password < 6) {
        return res.json({ error: "password should be atleast 6 digit long" });
      } else {
        data.password = req.body.password;
      }
    }
    if (req.body.image) {
      data.image = req.body.image;
    }
    let user = await User.findByIdAndUpdate(req.auth._id, data, { new: true });
    user.password = undefined;
    res.json(user);
  } catch (error) {
    if (error.code == 11000) {
      return res.json({ error: "duplicate username" });
    }
    console.log(error);
  }
};

const findpeople = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    let following = user.following;
    following.push(user._id);

    //get information of all people except the users in following

    const people = await User.find({ _id: { $nin: following } }).limit(10);
    //console.log(people)
    res.json(people);
  } catch (error) {
    console.log(error);
  }
};

const addfollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { followers: req.auth._id },
    });
    next();
  } catch (error) {
    console.log(error);
  }
};

const following = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.auth._id, {
      $addToSet: { following: req.body._id },
    });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

const followingpage = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const following = await User.find({ _id: user.following });
    res.json(following);
  } catch (error) {
    console.log(error);
  }
};

const removefollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: { followers: req.auth._id },
    });
    next();
  } catch (error) {
    console.log(error);
  }
};

const unfollowing = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.auth._id, {
      $pull: { following: req.body._id },
    });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

const conversation = async (req, res) => {
  try {
    const { senderid, receiverid } = req.body;
    const newconversation = new Conversations({
      members: [senderid, receiverid],
    });
    await newconversation.save();
    res.send("conversation created successfully");
  } catch (error) {
    console.log(error);
  }
};

const conversationload = async (req, res) => {
  try {
    const userid = req.params.userid;
    const conversations = await Conversations.find({
      members: { $in: [userid] },
    });

    const conversationuserdata = await Promise.all(
      conversations.map(async (conn) => {
        const receiverid = conn.members.find((member) => member !== userid);
        const user = await User.findById(receiverid);
        return { user, conversationid: conn._id };
      })
    );

    //console.log("conversationuserdata:", conversationuserdata);
    res.json(conversationuserdata);
  } catch (error) {
    console.log(error);
  }
};

const message = async (req, res) => {
  try {
    const { conversationid, senderid, message,receiverid} = req.body;
    
    if (!senderid || !message) {
      return res.status(400).send("senderid and message are required");
    }
    
    if (conversationid==="new" && receiverid) {
      const newconversation = new Conversations({
        members: [senderid, receiverid],
      });
      await newconversation.save();
      
      const newmessage = new Messages({ conversationid: newconversation._id, senderid, message });
      await newmessage.save();
      return res.send("message sent successfully");
    }
    
    else if (!conversationid&&!receiverid) {
      return res.status(400).send("conversationid or receiverid is required");
    }
    const newmessage = new Messages({ conversationid, senderid, message });
    await newmessage.save();
    res.send("message sent successfully");
    
} catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};


const messageload = async (req, res) => {
  try {
    const checkmessages=async (conversationid)=>{
      const messages = await Messages.find({ conversationid });
    const messageuserdata = await Promise.all(
      messages.map(async (message) => {
        const user = await User.findById(message.senderid);
        return { user, message: message.message };
      })
    );
    res.status(200).json(messageuserdata);
    }
    const conversationid = req.params.conversationid;
    if(conversationid==="new"){
      const checkconversation=await Conversations.find({members:{$all:[req.query.senderid,req.query.receiverid]}})
      if(checkconversation.length>0){
        checkmessages(checkconversation[0]._id);
      }else{return res.status(200).json([])}
    }
    else{
      checkmessages(conversationid);
    } 
  } catch (error) {
    console.log(error);
  }
};

const allusers=async (req,res)=>{
  try {
    const users=await User.find({ _id: { $ne: req.auth._id } })
    res.json(users)
  } catch (error) {
    console.log(error)
  }
};

module.exports = {
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
  message,
  messageload,
  allusers,
};
