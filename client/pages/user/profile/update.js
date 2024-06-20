import { useState,useContext,useEffect } from "react";
import axios from 'axios';
import AuthForm from "../../../components/forms/authform";
import { useRouter } from "next/router";
import { UserContext } from "../../../context";
import {Modal,Avatar} from "antd"
import { CameraOutlined } from "@ant-design/icons";


const ProfileUpdate=()=>{
  const [username,setusername]=useState("")
  const [about,setabout]=useState("")
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [state,setState]=useContext(UserContext)
  const [image, setimage] = useState({});

  const router=useRouter();

  useEffect(()=>{
    if (state &&state.user&&state.token)
       { setusername(state.user.username)
        setabout(state.user.about)
        setName(state.user.name)
        setEmail(state.user.email)
        setimage(state.user.image)}
    },[state&&state.token]
  )

  const handlesubmit=async (e)=>{
    e.preventDefault();
    try {
      // console.log(name, email, password, secret);
      
      const {data}= await axios.put("http://localhost:3000/profileupdate"
        ,
        {
         username,
         about,
          name,
          email,
          password,
          image
        
        },{
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      
     // router.push("/login")
     
     let auth=JSON.parse(localStorage.getItem("auth"))
    auth.user=data;
    localStorage.setItem("auth",JSON.stringify(auth));
    setState({...state,user:data})

    console.log(data)
    } catch (err) {
      console.log("error",err)
    }
  };

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

  
  return(
      <div>
      <div className="container-fluid bg-secondary">
      <div className="row">
      <div className="col">
      <h1 className="text-center">Profile</h1>
      
      </div>
      </div>
      </div>
      
      <label className="d-flex justify-content-center">
                    {
                      image && image.url ? (<Avatar size={30} src={image.url} /> ) : (<CameraOutlined/>)
            
                    }
                    <input onChange={handleimage} type="file" accept="images/*" hidden />
                </label>
                    
      <AuthForm
      profileupdate={true}
      handlesubmit={handlesubmit}
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      username={username}
      setusername={setusername}
      about={about}
      setabout={setabout}
      />
</div>
  )

};
export default ProfileUpdate;