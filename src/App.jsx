import './App.css';
import './scss/styles.scss';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Landing from './components/Landing';
import Nav from './components/Navbar';
// import Nav from './components/Navbar';
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
    <Router>
           <div className="App">
            {
              /*
              <nav class="navbar navbar-default">
            <div class="container-fluid">
              <ul className="nav nav-pills navbar-expand">
                <li class="nav-item">
                  <Link to="/">Home</Link>
                </li>
                <li class="nav-item">
                  <Link to="/liveDb">Live Database</Link>
                </li>
                <li class="nav-item">
                  <Link to="/maps">Maps</Link>
                </li>
                <li class="nav-item">
                  <Link to="/submitObstruction">Submit Obstruction</Link>
                </li>
              </ul>
            </div>
          </nav> 
              */
            }
           
          
          <Nav session={session} setSession={setSession}/>
           <Routes>
                 <Route path='/' element ={< Landing />}></Route>
                 <Route path='/liveDb' element={< LiveDb />}></Route>
                 <Route path='/maps' element={< Maps />}></Route>
                 <Route path='/about' element={< About />}></Route>
                 <Route path='/submitObstruction' element={< SubmitObstruction />}></Route>
          </Routes>
          </div>
       </Router>
  );
}

export default App;
