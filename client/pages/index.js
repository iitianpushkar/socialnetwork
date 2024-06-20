import { useContext } from "react"
import {UserContext} from '../context'


const home=()=>{

    const [state,setState]=useContext(UserContext)
return(
    <div className="container">
        <div className="row">
<div className="col">

    <h1>HOME</h1>
</div>

        </div>
    </div>
)

}

export default home