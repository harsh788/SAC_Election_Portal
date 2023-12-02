import React from "react";
import { NavLink } from "reactstrap";

const Sidebar = () => {
    return(
        <div className="col-12 col-md-2 pt-3">
            <ul style={{listStyleType: "none"}}>
                <li><NavLink href="/">All Elections</NavLink></li>
                <li><NavLink href="/participants">All Participants</NavLink></li>
                <li><NavLink href="/votes">All Votes</NavLink></li>
            </ul>
        </div>
    )
}

export default Sidebar;