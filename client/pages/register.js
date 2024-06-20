  import { useState,useContext } from "react";
  import axios from 'axios';
  import AuthForm from "../components/forms/authform";
import { useRouter } from "next/router";
import { UserContext } from "../context";



const register=()=>{
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [state,setState]=useContext(UserContext)

    const router=useRouter();

    if(state&&state.token){router.push("/")}
    else{

    const handlesubmit=async (e)=>{
      e.preventDefault();
      try {
        // console.log(name, email, password, secret);
        
         await axios.post("http://localhost:3000/register"
          ,
          {
            name,
            email,
            password,
          
          }
        );
        
        router.push("/login")
        
      } catch (err) {
        console.log("error",err)
      }
    };

    
    
    return(
        <div>
        <div className="container-fluid bg-secondary">
        <div className="row">
        <div className="col">
        <h1 className="text-center">register</h1>
        </div>
        </div>
        </div>
        <AuthForm
        handlesubmit={handlesubmit}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        />
</div>
    )
  }
};
export default register;