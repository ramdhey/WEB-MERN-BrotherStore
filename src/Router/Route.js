import React from "react";
import Container from "react-bootstrap/esm/Container";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartScreen from "../pages/CartScreen";
import Home from "../pages/Home";


import ProductScreen from "./../pages/ProductScreen";
import LogIn from './../pages/Login';
import ShipingAddress from './../pages/ShippingAddress';
import Register from './../pages/Register';
import Paymen from './../pages/Paymen';
import Pemesanan from './../pages/Pemesanan';
import OrderScreen from "../pages/OrderScreen";
import HistoryOrder from './../pages/HistoryOrder';
import Profil from "../pages/Profil";





function RouterProject() {
  return (
    <div>
      <Router>
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:name" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<LogIn/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profil" element={<Profil/>}/>
            <Route path="/address" element={<ShipingAddress/>}/>
            <Route path="/payment" element={<Paymen/>}/>
            <Route path="/pemesanan" element={<Pemesanan/>}/>
            <Route path="/order/:id" element={<OrderScreen/>}/>
            <Route path="/riwayatTransaksi" element={<HistoryOrder/>}/>
            
          </Routes>
        </Container>
      </Router>
    </div>
  );
}

export default RouterProject;
