import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button
} from 'reactstrap';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="danger" dark>
        <NavbarBrand href="/">eVote</NavbarBrand>
        <Nav>
          <NavItem>
            <NavLink style={{color: 'white'}} href="/">
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink style={{color: 'white'}} href="/">
              About
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink style={{color: 'white'}} href="/">
              Contact
            </NavLink>
          </NavItem>
          <NavItem>
            <Button color="secondary" href="/login">Login</Button>
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  );
}

export default Navigation;