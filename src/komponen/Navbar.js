import React from "react";
import logonav from "../assets/image/chef-hat.png"
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Switch, Route, Link } from "react-router-dom";
import { Badge, Col, ListGroup, NavItem, Row } from "react-bootstrap";
import { useContext } from "react";
import { Store } from "./../StoreNContext/Store";

import { LinkContainer } from "react-router-bootstrap";

const NavBar = () => {
  const { state,dispatch:ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const logoutHandler = () =>{
    ctxDispatch({type:'USER_LOGOUT'})
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href= '/login'
  }
  return (
    <div>
      
        <Navbar bg="light" expand="lg">
          <Container fluid>
            <Navbar.Brand href="/">Semprot Sport</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto w-100 justify-content-end"
                style={{ maxHeight: "100px" }}
                navbarScroll
              >
                {/* <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">{cart.cartItems.length}</Badge>
                      
                    )}
                  </Link> */}
                <Nav.Link href="/cart" to="/cart">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Nav.Link>

                {userInfo ? (
                      <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                        <NavDropdown.Item href= "/profil" to="/profil">User Profil</NavDropdown.Item>
                        <NavDropdown.Item href= "/profil" to="/profil">History Pemesanan</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item href= "/logout" to="/logout" onClick={logoutHandler}>Logout</NavDropdown.Item>
            
                      </NavDropdown>
                    ):(
                      <Nav.Link href="/login"  to="/login">
                      Login
                      </Nav.Link>
                    )}
                <Nav.Link href="#action2">Link</Nav.Link>
                <NavDropdown title="Link" id="navbarScrollingDropdown">
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>


        

    </div>
  );
};

export default NavBar;
