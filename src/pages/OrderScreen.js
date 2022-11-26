import React, { useEffect } from "react";
import LoadingBox from "../komponen/LoadingBox";
import MessageBox from "../komponen/MessageBox";
import { useReducer } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../StoreNContext/Store";
import axios from "axios";
import { formatRupiah, getError } from "./../utils";
import { Helmet } from "react-helmet-async";
import { Card, ListGroup, Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case 'PAY_REQUEST':
      return {...state,loadingPay:true}

    case 'PAY_SUCCESS':
      return {...state,loadingPay:false,successPay:true}

    case 'PAY_FAIL':
      return {...state,loadingPay:false}

      case 'PAY_RESET':
        return {...state,loadingPay:false,successPay:false}

    default:
      return state;
  }
}

export default function OrderScreen() {
  const params = useParams();
  const { id: orderId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, order,successPay,loadingPay }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
    successPay:false,loadingPay:false
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/order/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });

        toast.success("Pembayaran Berhasil");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err){
    toast.error(getError(err))
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/order/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!userInfo) {
      return navigate("/login");
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if(successPay){
        dispatch({type:'PAY_RESET'})
      }
    } else {
      const loadPayPalScript = async () => {
        const { data: clientId } = await axios.get("/paypal", {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPayPalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch,successPay]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Orderan {orderId}</title>
      </Helmet>

      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pengiriman</Card.Title>
              <Card.Text>
                <strong>Name: </strong> {order.shippingAddress.fullName}
                <br />
                <strong>Alamat Pengiriman: </strong>
                {order.shippingAddress.detail},{order.shippingAddress.provinsi},
                {order.shippingAddress.kota}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox>
                  Dalam Proses Pengiriman ke {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Tidak Dikirim</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pembayaran</Card.Title>
              <Card.Text>
                <strong>Metode Pembayaran : </strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Telah Di Bayar Pada {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Belum Di Bayar</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Detail Order Product</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
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
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Title>Rincian Order </Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Produk</Col>

                  <Col>{formatRupiah(order.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Ongkos Kirim</Col>
                  <Col>{formatRupiah(order.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>{formatRupiah(order.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{formatRupiah(order.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {isPending ? (
                    <LoadingBox />
                  ) : (
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  )}
                  {loadingPay && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
