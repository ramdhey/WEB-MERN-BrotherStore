import React, { useEffect, useState } from "react";
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
import { toast } from 'react-toastify';
import { getError } from './../utils';
import axios from 'axios';
import Searchbox from "./Searchbox";
import ReactSwitch from "react-switch";
import lognav from '../assets/image/chip.png'

const NavBar = ({change,chek,theme}) => {
  const { state,dispatch:ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const logoutHandler = () =>{
    ctxDispatch({type:'USER_LOGOUT'})
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href= '/login'
  }

  const[sidebarIsOpen,setSidebarIsOpen] = useState(false)
  const[categori,setCategory] = useState([])

  useEffect(()=>{
    const fetchCategori = async () =>{
      try {
        const { data} = await axios.get(`/product/category`)
        setCategory(data)
      } catch (err) {
        toast.error(getError(err))
        
      }
    }
    fetchCategori()
  },[])

  return (
    <div>
    {/* <div className={sidebarIsOpen?"d-flex flex-coloumn site-container active-cont":"d-flex flex-coloumn site-container"}>
       */}
        <Navbar style={{ backgroundColor: '#E87D0B',width:'100%' }} className="text-white"  expand="lg">
          <Container fluid>
            {/* <Button variant="dark" onClick={()=>setSidebarIsOpen(!sidebarIsOpen)}><i className="fas fa-bars"></i></Button> */}
            <Navbar.Brand href="/" className="text-white"><img src={lognav} style={{width:'90px'}}/></Navbar.Brand>
            <Navbar.Brand href="/" className="text-white">Brother Store</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll"  />
            <Navbar.Collapse id="navbarScroll"  >
              <Nav
                className="me-auto w-100 justify-content-end text-white-50"
                style={{ maxHeight: "100px",maxWidth:"1030px" }}
                navbarScroll
              >
                {/* <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">{cart.cartItems.length}</Badge>
                      
                    )}
                  </Link> */}
                <Nav.Link href="/cart" to="/cart" className="text-white">
                  <i className="fas fa-shopping-cart"></i>
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Nav.Link>
                {/* <div className="switchColor">
                  <label>{theme === "light" ? "Light Mode" : "Dark Mode"}</label>
                <ReactSwitch onChange={change} checked={chek}/>
                </div> */}

                {userInfo ? (
                      <NavDropdown title={userInfo.name} id="basic-nav-dropdown"   >
                        {/* <NavDropdown.Item  href= "/profil" to="/profil">User Profil</NavDropdown.Item> */}
                        <NavDropdown.Item href= "/riwayatTransaksi" to="/riwayatTransaksi">History Pemesanan</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item href= "/logout" to="/logout" onClick={logoutHandler}>Logout</NavDropdown.Item>
            
                      </NavDropdown>
                    ):(
                      <Nav.Link href="/login"  to="/login" className="text-white">
                      Login
                      </Nav.Link>
                    )}
                
              </Nav>
              {/* <Searchbox/> */}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      
        <div className={sidebarIsOpen ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column' : 'side-navbar d-flex justify-content-between flex-wrap flex-column'}>

          <Nav className="flex-column text-white w-100 p-2"></Nav>
          <Nav.Item>Category</Nav.Item>
          {categori.map((category)=>(
            <Nav.Item key={category}>
              {/* <LinkContainer to ={`/search?category=${category}`} onClick={()=>setSidebarIsOpen(false)}>
                <Nav.Link>{category}</Nav.Link>
              </LinkContainer> */}
            </Nav.Item>
          ))}

 
        </div>


        

    </div>
  );
};

export default NavBar;
