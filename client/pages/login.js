import { useState,useContext } from "react";
import axios from 'axios';
import AuthForm from "../components/forms/authform";
import {useRouter} from "next/router";
import {UserContext} from '../context'


   

const login=()=>{
  const [state,setState]=useContext(UserContext)
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const router=useRouter();
  if(state&&state.token){router.push("/")}
else{
  const handlesubmit=(e)=>{
    e.preventDefault();
    console.log({email,password})
    axios.post("http://localhost:3000/login",{
      email,password
    }).then(({data}) =>{
      console.log({data});
      setState({
        user:data.user,
        token:data.token}
      )

      window.localStorage.setItem("auth",JSON.stringify(data))
    })
    .catch(error => {
      console.log('Error sending data', error);
    })

    router.push("/")
  }



  return(
      <div>
      <div className="container-fluid bg-secondary">
      <div className="row">
      <div className="col">
      <h1 className="text-center">LOGIN</h1>
      </div>
      </div>
      </div>
      <AuthForm
      handlesubmit={handlesubmit}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      page='login'
      />
</div>
  )
}
};
export default login;