import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  NavbarText,
} from 'reactstrap';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if(token) {
      setUser(jwtDecode(token));
    }
  });

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
    window.location.href='/';
  }

  return (
    <div>
      <Navbar color="success" dark>
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
          {user ? 
            <>
              <NavItem>
                <NavbarText style={{margin: 4, color: 'white', fontWeight: 'bold'}}>Hi there, {user.name}!</NavbarText>
              </NavItem>
              <NavItem>
                <Button color="danger" onClick={handleLogout} style={{margin: 4}}>Logout</Button>
              </NavItem>
            </>
          :
            <>
              <NavItem>
                <Button color="primary" href="/signup" style={{margin: 4}}>SignUp</Button>
              </NavItem>
              <NavItem>
                <Button color="primary" href="/login" style={{margin: 4}}>Login</Button>
              </NavItem>
            </>
          }
        </Nav>
      </Navbar>
    </div>
  );
}

export default Navigation;