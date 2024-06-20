import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context";
import axios from "axios";
import imagesource from "../function";
import { Avatar, List,Modal } from "antd";
import {io} from "socket.io-client";

const socket=io("http://localhost:8000")

const Chat = () => {
  const [state, setState] = useContext(UserContext);
  const [conversations, setconversations] = useState([]);
  const [messages, setmessages] = useState({ messages: [], receiver:{} });
  const [message,setmessage]=useState("")
  const [users,setusers]=useState([])


useEffect(()=>{
  if(state&&state.token){
      socket.emit("adduser",state.user._id);
  socket.on("getusers",users=>{console.log("active users:",users)})

  socket.on("getmessage",data=>{
    console.log("data:",data)
    setmessages(prev=>({
      ...prev,
      messages:[...prev.messages,{user:data.user,message:data.message}]
    }))
  })
  }
},[socket&&state&&state.token])

  useEffect(() => {
    if (state &&state.user&& state.token){ fetchconversations()
      fetchusers();}
  }, [state&&state.user && state.token]);

  const fetchconversations = async () => {
    const { data } = await axios.get(
      `http://localhost:3000/conversation/${state.user._id}`,{
        headers: { Authorization:`Bearer ${state.token}` },
      }
    );

    //const resdata=await res.json()
    console.log("resdata:", data);
    setconversations(data);
  };

  const fetchmessages = async (conversationid, user) => {
    const { data } = await axios.get(
      `http://localhost:3000/message/${conversationid}?senderid=${state.user._id}&&receiverid=${user._id}`,{
        headers: { Authorization:`Bearer ${state.token}` },
      }
    );
    setmessages({ messages: data, receiver: user,conversationid });
    console.log("messages:", messages);
  };

  const fetchusers = async () => {
    const { data } = await axios.get(
      "http://localhost:3000/users",{
        headers: { Authorization:`Bearer ${state.token}` },
      }
    );
    setusers(data);
    console.log("users:",users);
  };
const sendmessage=async ()=>{
     setmessage("")
  socket.emit("sendmessage",{
    senderid:state.user._id,
    receiverid:messages.receiver._id,
    conversationid:messages.conversationid,
    message
  })
  const {data}=await axios.post("http://localhost:3000/message",{
      conversationid:messages.conversationid,
      senderid:state.user._id,
      message,
      receiverid:messages.receiver._id
  },{
    headers: { Authorization:`Bearer ${state.token}` },
  })
}

  return (
    <div className="container-fluid bg-secondary" style={{ height: "100vh" }}>
      <div className="row h-100">
        <div className="col-4 border border-dark">
          {conversations.length > 0 ? (
            conversations.map(({ conversationid, user }) => (
              <div key={conversationid} className="d-flex align-items-center py-3 border-bottom border-gray">
                <div
                  className="d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => fetchmessages(conversationid, user)}
                >
                  <div>
                    <img
                      src={user&&user.image.url}
                      className="rounded-circle"
                      style={{
                        width: "60px",
                        height: "60px",
                        padding: "2px",
                        border: "1px solid #007bff",
                      }}
                    />
                  </div>
                  <div className="ms-3">
                    <h3 className="h5 font-weight-semibold">{user&&user.name}</h3>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center h5 font-weight-semibold mt-5">
              no conversations
            </div>
          )}
        </div>
        <div
          className="col-4 border border-dark bg-white d-flex flex-column justify-content-between"
          style={{ position: "relative", height: "100vh" }}
        >
          {messages.receiver.name && (
            <div
              className="rounded-pill d-flex justify-content-center align-items-center"
              style={{
                width: "100%",
                height: "80px",
                marginTop: "1rem",
                padding: "0 3.5rem",
                backgroundColor: "lightblue",
              }}
            >
              <div className="cursor-pointer">
                <img
                  src={messages.receiver.image.url}
                  width={60}
                  height={60}
                  className="rounded-circle"
                  alt="Receiver"
                />
              </div>
              <div className="ms-3 me-auto">
                <h3 className="h5">{messages.receiver.name}</h3>
              </div>
            </div>
          )}
          <div
            className="w-100 overflow-auto shadow-sm flex-grow-1"
            style={{ padding: "1rem" }}
          >
            <div className="p-3">
              {state && state.user&& messages.messages.length > 0 ? (
                messages.messages.map(({ message, user }) => {
                  if (user._id === state.user._id) {
                    return (
                      <div
                        key={user._id}
                        className="bg-primary rounded-bottom rounded-start text-white ms-auto"
                        style={{
                          maxWidth: "40%",
                          padding: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {message}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={user._id}
                        className="bg-secondary rounded-bottom rounded-end"
                        style={{
                          maxWidth: "40%",
                          padding: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {message}
                      </div>
                    );
                  }
                })
              ) : (
                <div className="text-center text-lg font-weight-semibold mt-5">
                  No Messages
                </div>
              )}
            </div>
          </div>

          <div
            className="p-4 w-100 d-flex align-items-center"
            style={{ position: "relative" }}
          >
            <input
              placeholder="type a message"
              value={message}
              onChange={(e)=>setmessage(e.target.value)}
              className="form-control shadow-sm rounded-pill bg-light"
              style={{
                width: "75%",
                padding: "1rem",
                border: "none",
                outline: "none",
              }}
            />
            <button className="btn btn-primary shadow rounded-pill ms-3" disabled={!message} onClick={()=>sendmessage()}>
              send
            </button>
          </div>
        </div>

        <div className="col-4 border border-dark">
          <div className="text-center text-white">USERS ON THIS SITE</div>
          <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={imagesource(user)} />}
              title={
                <div className="d-flex justify-content-between" onClick={()=>fetchmessages("new",user)} style={{cursor:"pointer"}}>
                  {user.username}
                
                </div>
              }
            />
          </List.Item>
        )}
      />
          </div>
      </div>
    </div>
  );
};

export default Chat;
