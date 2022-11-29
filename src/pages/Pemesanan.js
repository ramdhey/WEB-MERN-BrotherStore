import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import CheckOut from "../komponen/CheckOut";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "./../StoreNContext/Store";
import { formatRupiah } from "../utils";
import { toast } from 'react-toastify';
import { getError } from './../utils';
import axios from 'axios';
import LoadingBox from "../komponen/LoadingBox";

const reducer = (state,action)=>{
    switch(action.type){
        case 'CREATE_REQUEST':
            return{...state,loading:true}
        case 'CREATE_SUCCESS':
                return{...state,loading:false}
    
        case 'CREATE_FAIL':
                return{...state,loading:false}

        default:
            return state
    }
}

export default function Pemesanan() {
    
  const navigate = useNavigate();

  const [{loading},dispatch] = useReducer(reducer,{
    loading:false,
    
  })

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart, userInfo } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(15000) : round2(10);
  cart.taxPrice = round2(0.03 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const buatOrder = async() => {
    try {
        dispatch({type:'CREATE_REQUEST'})
        const {data} = await axios.post(
            '/order',
            {
                orderItems:cart.cartItems,
                shippingAddress:cart.shippingAddress,
                paymentMethod:cart.paymentMethod,
                itemsPrice:cart.itemsPrice,
                shippingPrice:cart.shippingPrice,
                taxPrice:cart.taxPrice,
                totalPrice:cart.totalPrice,

            },
            {
                headers:{
                    authorization:`Bearer ${userInfo.token}`,
                }
            }
        )
        ctxDispatch({type:'CART_CLEAR'})
        dispatch({type:'CREATE_SUCCESS'})
        localStorage.removeItem('cartItems')
        navigate(`/order/${data.order._id}`)
        
    } catch (err) {
        dispatch({type:'CREATE_FAIL'})
        toast.error(getError(err))
        
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  return (
    <div>
      <CheckOut step1 step2 step3 step4></CheckOut>
      <Helmet>
        <title>Detail Pesanan</title>
      </Helmet>
      <h1 className="my-3">Detail Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Atas Nama</Card.Title>
              <Card.Text>
                <strong>Nama Penerima : </strong>{" "}
                {cart.shippingAddress.fullName}
                <br />
                <strong>Detail Alamat : </strong>
                {cart.shippingAddress.detail},{cart.shippingAddress.provinsi},
                {cart.shippingAddress.kota}
              </Card.Text>
              <Link to="/address">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pembayaran</Card.Title>
              <Card.Text>
                <strong>Metode Pembayaran : </strong> {cart.paymentMethod}
                <br />
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Detail Order Product</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row>
                      <Col md={6}>
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{" "}
                        <Link to={`/product/${item.name}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>{formatRupiah(item.price)}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Title className='rincian'>Rincian Order </Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Produk</Col>

                  <Col>{formatRupiah(cart.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Ongkos Kirim</Col>
                  <Col>{formatRupiah(cart.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>{formatRupiah(cart.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{formatRupiah(cart.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <div>
                  <Button
                  style={{backgroundColor:'#E87D0B'}}
                    type="button"
                    onClick={buatOrder}
                    disabled={cart.cartItems.length === 0}
                  >
                    Buat Order
                  </Button>
                </div>
                {loading && <LoadingBox></LoadingBox>}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
