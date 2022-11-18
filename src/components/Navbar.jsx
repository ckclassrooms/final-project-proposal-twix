import React from 'react'
import { NavLink } from 'react-router-dom'
import {supabase} from '../supabaseClient'
function Nav({session, setSession}) {
    
    const loginSubmit = async ()=>{
        // Todo - Add logic to login via Github Oauth
        let { user, error } = await supabase.auth.signInWithOAuth({
            provider: 'github'
          })
          console.log("user",user)
          console.log("err",error)
        // setSession("Setting Something as session")
    }

    const logoutSubmit = async ()=>{
        // Todo - Add logic to logout
        let { error } = await supabase.auth.signOut()
        console.log(error)
        // setSession(null);
    }

    if (session != null){
        return ( <ul className="nav nav-pills navbar-expand">
        <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/" end>Home</NavLink></li>
        <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/about">About </NavLink></li>   
        <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/liveDb">Live Database</NavLink></li>
        <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/maps">Maps</NavLink></li>
        <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/submitObstruction">Submit Obstruction</NavLink></li>   
        <li className="nav-item ms-auto"><button className="btn btn-primary m-1" id='logoutSubmit' onClick={()=>logoutSubmit()}>Logout</button></li>       
    </ul>)
    }
    else {
        return ( 
        <ul className="nav nav-pills navbar-expand">
            <li className="nav-item "><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/" end>Home</NavLink></li>
            <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/liveDb">Live Database</NavLink></li>
            <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/submitObstruction">Submit Obstruction</NavLink></li> 
            <div className="ms-auto" style={{display:"flex"}}>

            <li className="nav-item ms-auto"><button className="btn btn-primary m-1" id='loginSubmit' onClick={()=>loginSubmit()}>Login</button></li>
            </div>              
        </ul>)
    }
}

export default Nav