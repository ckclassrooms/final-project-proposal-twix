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

  const [session, setSession] = useState(null);
  const [loginFlag, setLoginflag] = useState(0);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(()=>{

    if (session==null){
      // console.log("I am null")
    }
    else{
      if (loginFlag === 0){
        alert("Hi, I am logged in")
        setLoginflag(1)
      }
    }

  }, [session, loginFlag])

  return (
      <>
        <Nav session={session} setSession={setSession}/>
           <Routes>
              <Route path='/' element ={< Landing />}></Route>
              <Route path='/about' element={< About />}></Route>
              <Route path='/liveDb' element={< LiveDb />}></Route>
              <Route path='/maps' element={< Maps />}></Route>
              <Route exact path="/submitObstruction" element={session  ? <SubmitObstruction /> : <Navigate to = "/"/> }></Route>
          </Routes>
      </>  
  );
}

export default App;