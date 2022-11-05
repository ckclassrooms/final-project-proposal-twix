import './App.css';
import './scss/styles.scss';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Landing from './components/Landing';
// import Nav from './components/Navbar';
import SubmitObstruction from './components/SubmitObstruction';
import LiveDb from './components/LiveDb';
import Maps from './components/Maps';

function App() {
  return (
    <Router>
           <div className="App">
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
           <Routes>
                 <Route path='/' element ={< Landing />}></Route>
                 <Route path='/liveDb' element={< LiveDb />}></Route>
                 <Route path='/maps' element={< Maps />}></Route>
                 <Route path='/submitObstruction' element={< SubmitObstruction />}></Route>
          </Routes>
          </div>
       </Router>
  );
}

export default App;
