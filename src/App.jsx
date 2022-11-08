import './App.css';
import './scss/styles.scss';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Nav from './components/Navbar';
import SubmitObstruction from './components/SubmitObstruction';
import LiveDb from './components/LiveDb';
import Maps from './components/Maps';
import About from './components/About';
import { useState, useEffect } from "react";
import {supabase} from './supabaseClient'
function App() {

  const [session, setSession] = useState(null);
  // const [requests, setRequests] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
      <>
        <Nav session={session} setSession={setSession}/>
           <Routes>
              <Route path='/' element ={< Landing />}></Route>
              <Route path='/about' element={< About />}></Route>
              <Route path='/liveDb' element={< LiveDb />}></Route>
              <Route path='/maps' element={< Maps />}></Route>
              <Route path='/submitObstruction' element={< SubmitObstruction />}></Route>
          </Routes>
      </>  
  );
}

export default App;
