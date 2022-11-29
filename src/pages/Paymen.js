import { Helmet } from "react-helmet-async";
import { Button, Form } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../StoreNContext/Store";
import CheckOut from "../komponen/CheckOut";
import { Link } from "react-router-dom";

export default function Paymen() {
  const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'Paypal'
  );

  useEffect(() => {
    if (!shippingAddress.detail) {
      navigate("/address");
    }
  }, [shippingAddress, navigate]);

  
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod',paymentMethodName);
    navigate('/pemesanan')
    
    
    
    
  };
  

  return (
    <div>
      <Helmet>
        <title>Metode Pembayaran</title>
      </Helmet>

      <CheckOut step1 step2 step3></CheckOut>
      <h1 className="my-3">Metode Pembayaran</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <Form.Check
            type="radio"
            id="Paypal"
            label="Paypal"
            value="Paypal"
            checked={paymentMethodName === 'Paypal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="radio"
            id="Stripe"
            label="Stripe"
            value="Stripe"
            checked={paymentMethodName === 'Stripe'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </Form.Group>

        <div className="mb-3">
          
          <Button type="submit" style={{backgroundColor:'#E87D0B'}}>Lanjutkan Pembayaran</Button>
          
        </div>
      </Form>
    </div>
  );
}
