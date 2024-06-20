import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UseRoute from "../components/router/UserRouter";
import CreatePostForm from "../components/forms/CreatePostForm";
import axios from "axios";
import { UserContext } from "../context";
import { useContext } from "react";
import PostList from "../components/cards/PostList";
import People from "../components/cards/People";
import { Modal} from "antd";
import Link from "next/link";

const dashboard = () => {
  //state
  const [content, setContent] = useState("");
  const [image, setimage] = useState({});
  const [state, setState] = useContext(UserContext);
  const [posts, setposts] = useState([]);
  const [people, setpeople] = useState([]);
  //comment
  const [comment, setcomment] = useState("");
  const [visible, setvisible] = useState(false);
  const [currentpost, setcurrentpost] = useState({});

  const router = useRouter();

  useEffect(() => {
    if (state && state.token)
      { fetchuserposts();
      findpeople()
    }
  }, [state && state.token]);

  const fetchuserposts = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/userposts", {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      // console.log(data)
      setposts(data);
    } catch (error) {
      console.log(error);
    }
  };

const findpeople=async (req,res)=>{
  try {
    const {data}=await axios.get("http://localhost:3000/findpeople",{
      headers: { Authorization:`Bearer ${state.token}` },
    })
    console.log(data)
  setpeople(data)
  } catch (error) {
    console.log("error while getting people from database:",error)
  }
  
}

  //function

  const postsubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/createpost",
        { content, image },
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      console.log("response after posting", data);
    } catch (error) {
      console.log("error while posting", error);
    }
  };

  // to handle image upload

  const handleimage = async (e) => {
    const file = e.target.files[0];
    let formdata = new FormData();
    formdata.append("images", file);
    console.log([...formdata]);
    try {
      const { data } = await axios.post(
        "http://localhost:3000/uploadimage",
        formdata,
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );

      //console.log(data)
      setimage({
        url: data.url,
        public_id: data.public_id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlelike = async (_id) => {
    try {
      const { data } = await axios.put(
        "http://localhost:3000/likepost",
        { _id },
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      await fetchuserposts();
      //  console.log(data)
    } catch (error) {
      console.log("error while like:", error);
    }
  };

  const handleunlike = async (_id) => {
    try {
      const { data } = await axios.put(
        "http://localhost:3000/unlikepost",
        { _id },
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      await fetchuserposts();
      // console.log(data)
    } catch (error) {
      console.log("error while like:", error);
    }
  };

  const handlecomment = (post) => {
    setcurrentpost(post);
    setvisible(true);
  };

  const addcomment = async (e) => {
    e.preventDefault();
    console.log("add comment to this post id:", currentpost._id);
    console.log("add comment to database:", comment);

    try {
      const { data } = await axios.put(
        "http://localhost:3000/addcomment",
        {
          postid: currentpost._id,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      console.log("addcomment", data);
      setcomment("");
      setvisible(false);
      fetchuserposts();
    } catch (error) {
      console.log("while sending comment to server:", error);
    }
  };

  const removecomment = async () => {
    try {
      const { data } = await axios.put(
        "http://localhost:3000/addcomment",
        {
          postid: currentpost._id,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      console.log("addcomment", data);
      setcomment("");
      setvisible(false);
      fetchuserposts();
    } catch (error) {
      console.log("while sending comment to server:", error);
    }
  };

const handlefollow=async (user)=>{
    try {
      const {data}=await axios.put("http://localhost:3000/following",{_id:user._id},{
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

  return (
    <UseRoute>
      <div className="container-fluid">
        <div className="row py-5 bg-default-image">
          <div className="col text-center">
            <h1>Newsfeed</h1>
          </div>
        </div>

        <div className="row py-3">
          <div className="col-md-8">
            <CreatePostForm
              content={content}
              setContent={setContent}
              postsubmit={postsubmit}
              handleimage={handleimage}
              image={image}
            />

            <PostList
              state={state}
              posts={posts}
              handlelike={handlelike}
              handleunlike={handleunlike}
              handlecomment={handlecomment}
            />
          </div>
          <div className="col-md-4">
          <div className="d-flex justify-content-between">
  {state && state.user && state.user.following && (
    <>
      <div className="d-inline-block">
        <Link className="text-decoration-none" href={`/user/followingpage`}>
          {/*state.user.following.length*/} Following
        </Link>
      </div>
      <div className="d-inline-block"> {/* Add margin-left for spacing */}
        <Link className="text-decoration-none" href={`/textchat`}>
          Messages
        </Link>
      </div>
    </>
  )}
</div>
        <People people={people} handlefollow={handlefollow} />
            </div>
          
        </div>
      </div>
      <div>
        <Modal
          title="comment"
          open={visible}
          onCancel={() => setvisible(false)}
          footer={null}
        >
          <form onSubmit={addcomment}>
            <input
              type="text"
              className="form-control"
              placeholder="write comment"
              value={comment}
              onChange={(e) => setcomment(e.target.value)}
            />
            <button className="btn btn-primary btn-block mt-3">submit</button>
          </form>
        </Modal>
      </div>
    </UseRoute>
  );
};

export default dashboard;
