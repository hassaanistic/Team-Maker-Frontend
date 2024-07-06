import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import { useNavigate } from "react-router-dom";
import axios from 'axios';


function NavbarC(){
  
  const navigate = useNavigate();
    const handleLogout = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/logout`);
        // Clear any stored token or user information in the frontend (optional)
        // Redirect the user to the login page or any other desired page
        localStorage.removeItem('token');
        navigate("/");
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/dashboard">Home</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/playerslist">Players</Nav.Link>
            <Nav.Link href="/teams">Teams</Nav.Link>
          </Nav>
          <Button onClick={handleLogout}>Logout</Button>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarC;