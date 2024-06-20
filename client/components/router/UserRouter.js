import { useState,useContext,useEffect } from "react";
import axios from 'axios'
import { UserContext } from "../../context";
import { useRouter} from "next/router";

const UseRoute=({children})=>{
       const [ok,setOk]=useState(false)
       const [state,setState]=useContext(UserContext)
       const router=useRouter();

       useEffect(
        ()=>{
            if(state&&state.token){getcurrentuser()}
        },[state&&state.token]
       )

       const getcurrentuser= async()=>{
     try {
        const {data}=await axios.get("http://localhost:3000/getcurrentuser",
            {
                headers:{"Authorization":`Bearer ${state.token}`}
     })
       if(data.ok){setOk(true),console.log("user verified")}
     } catch (error) {
       console.log("error:",error),
        router.push("/login")
     }

       }

       if(state==null){setTimeout(()=>{getcurrentuser()},1000)}

    return !ok?(
       <div>
        <h1>first login bro</h1>
       </div>
    ):(
        <>{children}</>
    )
}

export default UseRoute;

