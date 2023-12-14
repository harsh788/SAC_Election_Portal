import React from "react";
import { Nav, NavItem, NavLink, Col } from "reactstrap";

const Sidebar = () => {
    return (
        <Col xs="12" md="2" className="pt-3">
            <Nav vertical>
                <NavItem>
                    <NavLink href="/">All Elections</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/participants">All Participants</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/votes">All Votes</NavLink>
                </NavItem>
            </Nav>
        </Col>
    );
};

export default Sidebar;
