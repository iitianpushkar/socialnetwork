import { UseEffect,createContext,useEffect,useState} from "react";
const UserContext=createContext();

const UserProvider=({children})=>{
    const [state,setState]=useState({
        user:{},
        token:""
    })
    useEffect(()=>{
        setState(JSON.parse(window.localStorage.getItem("auth")))
    })
    return(
        <UserContext.Provider value = {[state,setState]}>

            {children}     
        </UserContext.Provider>
    )
};

export {UserProvider,UserContext};