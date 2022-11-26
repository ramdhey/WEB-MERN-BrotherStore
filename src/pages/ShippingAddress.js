import { Helmet } from "react-helmet-async";
import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../StoreNContext/Store";
import CheckOut from './../komponen/CheckOut';

export default function ShipingAddress() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const{userInfo,
    cart:{shippingAddress},
  } = state
  const [fullName, setFullname] = useState(shippingAddress.fullName||"");
  const [detail, setDetail] = useState(shippingAddress.detail || "");
  const [provinsi, setProvinsi] = useState(shippingAddress.provinsi || "");
  const [kota, setKota] = useState(shippingAddress.kota ||  "");
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_ADDRESS',
      payload: {
        fullName,
        detail,
        provinsi,
        kota,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        detail,
        provinsi,
        kota,
      })
    );
    navigate("/payment");
  };


  useEffect(()=>{
    if(!userInfo){
        navigate('/login?redirect=/address')
    }
  },[userInfo,navigate])

  return (
    <div>
      <Helmet>Alamat Pengiriman</Helmet>
      <CheckOut step1 step2></CheckOut>
      <h1>Alamat Pengiriman</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="fullName">
          <Form.Label>Nama Penerima</Form.Label>
          <Form.Control
            value={fullName}
            placeholder="Nama Penerima"
            required
            onChange={(e) => setFullname(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="detail">
          <Form.Label>Detail Alamat</Form.Label>
          <Form.Control
            value={detail}
            placeholder="Detail Alamat"
            required
            onChange={(e) => setDetail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="provinsi">
          <Form.Label>Provinsi</Form.Label>
          <Form.Control
            value={provinsi}
            placeholder="Provinsi"
            required
            onChange={(e) => setProvinsi(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="kota">
          <Form.Label>Kota/Kabupaten</Form.Label>
          <Form.Control
            value={kota}
            placeholder="Kota/Kabupaten"
            required
            onChange={(e) => setKota(e.target.value)}
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">Simpan</Button>
        </div>
      </Form>
    </div>
  );
}
