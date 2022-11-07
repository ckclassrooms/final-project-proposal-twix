import React from 'react'
import { NavLink } from 'react-router-dom'
function Nav() {
    return (
        <ul className="nav nav-pills navbar-expand">
            <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
                to="/" end>Home</NavLink></li>
            <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
                to="/liveDb">Live Database</NavLink></li>
            <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
                to="/maps">Maps</NavLink></li>
            <li className="nav-item"><NavLink className={({ isActive }) => "nav-link " + (isActive ? " active" : "")}
                to="/submitObstruction">Submit Obstruction</NavLink></li>
        </ul>
    )
}

export default Nav