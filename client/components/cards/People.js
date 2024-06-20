import moment from "moment";
import { Avatar, List } from "antd";
import { useContext } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import imagesource from "../../function";

const People = ({ people,handlefollow }) => {
  const [state, setState] = useContext(UserContext);
  //console.log({people})
  //const router=useRouter()
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
          avatar= {<Avatar src={imagesource(user)} />}
              title={
                <div className="d-flex justify-content-between">
                  {user.username}
                  <span className="text-primary" onClick={()=>handlefollow(user)} style={{cursor:"pointer"}}>follow</span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default People;
