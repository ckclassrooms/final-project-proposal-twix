import './App.css';
import './scss/styles.scss';
import { Navigate, Routes, Route } from "react-router-dom";
import Landing from './components/Landing';
import Nav from './components/Navbar';
import SubmitObstruction from './components/SubmitObstruction';
import LiveDb from './components/LiveDb';
import Maps from './components/Maps';
import About from './components/About';
import { supabase } from './supabaseClient'
import { useState, useEffect } from "react";
function App() {
  //console.log("vALUE ",supabase.auth.user());
  const [session, setSession] = useState(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    console.log("App.jsx use effect, session = ",session)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log(" get session body session session",session)
  
      // alert("Login Successful!!")
      // setIsLoggedIn(true);
    });
  
    //console.log("vALUE ",supabase.auth.user());
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      console.log(" auth state changes session",session)
  
      
      // else{
      //   alert("logged out")
      // }
      // alert("Logged out")
    });
  });

  return (
      <>
        <Nav session={session} setSession={setSession}/>
           <Routes>
              <Route path='/' element ={< Landing />}></Route>
              <Route path='/about' element={< About />}></Route>
              <Route path='/liveDb' element={< LiveDb />}></Route>
              <Route path='/maps' element={< Maps />}></Route>
              <Route exact path="/submitObstruction" element={session  ? <SubmitObstruction /> : <Navigate to = "/"/> }></Route>
              {/* <Route exact path="/submitObstruction" render={() => (
                supabase.auth.user() ? (
                <Navigate to = "/submitObstruction"/>
                ) : (
                  <Landing />
                )
              )}/> */}
          </Routes>
      </>  
  );
}

export default App;