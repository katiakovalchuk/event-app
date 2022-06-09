import React, {useState} from "react";
import {Link} from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as CgIcons from "react-icons/cg";
import {SidebarData} from "./SidebarData";
import {IconContext} from "react-icons";
import {useUserAuth} from "../../context/authContext";
import {ROLES} from "../../store/roles";
import "./Navbar.css";

function Navbar() {
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    const {logout} = useUserAuth();
    const userRole = JSON.parse(localStorage.getItem("role"));

    return (
        <>
            {
                <IconContext.Provider value={{color: "#fff"}}>
                    <div className="navbar">
                        <div className="navbar-menu">
                            <Link to="#" className="menu-bars">
                                <FaIcons.FaBars onClick={showSidebar}/>
                            </Link>
                        </div>
                        <div className="menu-profile">
                            {
                                userRole === ROLES.user &&
                                <Link to="/profile" className="menu-prof">
                                    <CgIcons.CgProfile/>
                                </Link>
                            }
                            <span className="logout-btn">
                                <AiIcons.AiOutlineLogout onClick={logout}/>
                            </span>
                        </div>
                    </div>
                    <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
                        <ul className="nav-menu-items" onClick={showSidebar}>
                            <li className="navbar-toggle">
                                <Link to="#" className="menu-bars">
                                    <AiIcons.AiOutlineClose/>
                                </Link>
                            </li>
                            {SidebarData[userRole].map((item, index) => {
                                return (
                                    <li key={index} className={item.cName}>
                                        <Link className="d-flex" to={item.path}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </IconContext.Provider>
            }
        </>
    );
}

export default Navbar;
