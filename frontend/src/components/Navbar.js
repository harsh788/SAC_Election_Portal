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
        <NavbarBrand href="/">SAC Election Portal</NavbarBrand>
        <Nav>
          <NavItem>
            <NavLink style={{color: 'white'}} href="/">
              Elections
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink style={{color: 'white'}} href="/participants">
              Participants
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink style={{color: 'white'}} href="/votes">
              Votes
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