import React from 'react'
import { NavLink } from 'react-router-dom'
import {supabase} from '../supabaseClient'
import { useState } from "react";
function Nav({session, setSession}) {
    
    const [toggleMenu, setToggleMenu] = useState(false);
    const loginSubmit = async ()=>{
        // Todo - Add logic to login via Github Oauth
        let { user, error } = await supabase.auth.signInWithOAuth({
            provider: 'github'
          })
          setSession(user); 
          console.log("in login submit user",user)
          console.log("err",error)
        //   if (user !=null){
        //     alert("Login Successful!!")
        //   }
        //   if (error == null){
        //   alert("Login Successful!")}
        // setSession("Setting Something as session")
        // if user!= null{
        //     // alert("Login Successful!!!")
        // }
    }
    const logoutSubmit = async ()=>{
        // Todo - Add logic to logout
        let { error } = await supabase.auth.signOut()
        if(error==null){
            
            setSession(null);
        }
           
        console.log("In logout submit with session = ",session);
        console.log(error)
        // setSession(null);
    }
    
    function collapseNavBar() {
        document.getElementsByClassName("nav-pills")[0].classList.remove('responsive');
        setToggleMenu(false);
    }

    function onMenuIconClick() {
        if (!toggleMenu) {
            document.getElementsByClassName("nav-pills")[0].classList.add('responsive');
            setToggleMenu(true);
        } else {
            collapseNavBar();
        }
    }

    if (session != null){
        return ( <ul className="nav nav-pills navbar-expand fixed-top">
        <li className="nav-item icons" onMouseDown={(event) => {onMenuIconClick()}}><NavLink><i class="bi bi-list"></i></NavLink></li>
        <li className="nav-item"><NavLink onClick={collapseNavBar} className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/" end>Home</NavLink></li>
        <li className="nav-item"><NavLink onClick={collapseNavBar} className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/about">About </NavLink></li>   
        <li className="nav-item"><NavLink onClick={collapseNavBar} className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/liveDb">Live Database</NavLink></li>
        <li className="nav-item"><NavLink onClick={collapseNavBar} className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/maps">Maps</NavLink></li>
        <li className="nav-item"><NavLink onClick={collapseNavBar} className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/submitObstruction">Submit Obstruction</NavLink></li>   
        <li className="nav-item ms-auto"><button className="btn btn-primary m-1" id='logoutSubmit' onClick={()=> {collapseNavBar(); logoutSubmit();}}>Logout</button></li>      
    </ul>)
    }
    else {
        return ( 
        <ul className="nav nav-pills navbar-expand fixed-top">
            <li className="nav-item icons" onMouseDown={(event) => {onMenuIconClick()}}><NavLink><i class="bi bi-list"></i></NavLink></li>
            <li className="nav-item "><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/" end>Home</NavLink></li>
            <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/about">About </NavLink></li>
            <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/liveDb">Live Database</NavLink></li>
            <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
            to="/maps">Maps</NavLink></li>
            <div className="ms-auto" style={{display:"flex"}}>
            <li className="nav-item ms-auto"><button className="btn btn-primary m-1" id='loginSubmit' onClick={()=>loginSubmit()}>Login</button></li>
            </div>              
        </ul>)
    }
}

export default Nav