import React from "react";
import { NavLink } from "reactstrap";

const Sidebar = () => {
    return(
        <div className="col-3 ">
            <ul style={{listStyleType: "none"}}>
                <li><NavLink href="/">All Elections</NavLink></li>
                <li><NavLink href="/candidates">All Candidates</NavLink></li>
                <li><NavLink href="/students">All Students</NavLink></li>
                <li><NavLink href="/votes">All Votes</NavLink></li>
            </ul>
        </div>
    )
}

export default Sidebar;