import { useContext } from "react";
import { Store } from "../StoreNContext/Store";
import { Helmet } from "react-helmet-async";
import { Button, Card, ListGroup, Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import MessageBox from "../komponen/MessageBox";
import { Link, useNavigate } from "react-router-dom";
import { formatRupiah } from "../utils";
import axios from "axios";

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updatejumlahHandler = async (item, quantity) => {
    const { data } = await axios.get(`/product/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Maaf , Kamu Kehabisan , kembali lagi lain waktu ya.");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({
      type: "CART_REMOVE_ITEM",
      payload: item,
    });
  };

  const checkOutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div>
      <Helmet>
        <title>Keranjang Belanja</title>
      </Helmet>

      <div className="container small-container">
        <h1>Keranjang Belanja</h1>

        <Row>
          <Col md={8}>
            {cartItems.length === 0 ? (
              <MessageBox>
                Keranjang nya Kosong nih, <Link to="/"> Belanja Yuk </Link>
              </MessageBox>
            ) : (
              <ListGroup>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={4}>
                        <img
                          className="img-fluid rounded img-thumbnail"
                          src={item.image_url}
                          alt={item.name}
                        ></img>{" "}
                        <Link to={`/product/${item.name}`}>{item.name}</Link>
                      </Col>

                      {/* plus minus add item */}

                      <Col md={3}>
                        <Button
                          onClick={() =>
                            updatejumlahHandler(item, item.quantity - 1)
                          }
                          variant="light"
                          disabled={item.quantity === 1}
                        >
                          <i className="fas fa-minus-circle"></i>
                        </Button>{" "}
                        <span>{item.quantity}</span>{" "}
                        <Button
                          variant="light"
                          onClick={() =>
                            updatejumlahHandler(item, item.quantity + 1)
                          }
                          disabled={item.quantity === item.countInStock}
                        >
                          <i className="fas fa-plus-circle"></i>
                        </Button>{" "}
                      </Col>

                      <Col md={3}>{formatRupiah(item.price)}</Col>
                      <Col md={2}>
                        <Button
                          variant="light"
                          onClick={() => removeItemHandler(item)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                    items):{" "}
                    {formatRupiah(
                      cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
                    )}
                  </h3>
                </ListGroup>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Link to="/address">
                      <Button
                        type="button"
                        variant="primary"
                        disabled={cartItems.length === 0}
                        onClick={checkOutHandler}
                      >
                        Lanjut ke Pembayaran
                      </Button>
                    </Link>
                  </div>
                </ListGroup.Item>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
