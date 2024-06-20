import moment from "moment";
import { Avatar, List,Modal } from "antd";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import imagesource from "../../function";
import axios from "axios";
import Link from "next/link";
import Chat from "../textchat";

const following = () => {
  const [state, setState] = useContext(UserContext);
  const [people, setpeople] = useState([]);
  

  useEffect(() => {
    if (state && state.token) fetchfollowing();
  }, [state && state.token]);

  const fetchfollowing = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/followingpage", {
        headers: { Authorization: `Bearer ${state.token}` },
      });

      setpeople(data);
    } catch (error) {}
  };

  const handleunfollow=async (user)=>{
    try {
      const {data}=await axios.put("http://localhost:3000/unfollowing",{_id:user._id},{
        headers: { Authorization: `Bearer ${state.token}` },
      })
      

      let auth=await JSON.parse(localStorage.getItem("auth"))
      auth.user=data;
      localStorage.setItem("auth",JSON.stringify(auth))

      await setState({...state,user:data});

      let filter=people.filter((p)=>p._id!==user._id)
      setpeople(filter)

    } catch (error) {
      console.log(error)
    }
}



/*const handlemessage=async (user)=>{
       
  try {
   

  } catch (error) {
    console.log(error)
  }
}*/
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={imagesource(user)} />}
              title={
                <div className="d-flex justify-content-between">
                  {user.username}
              
                  <span
                    className="text-primary"
                    onClick={() => handleunfollow(user)}
                    style={{ cursor: "pointer" }}
                  >
                    unfollow
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default following;
