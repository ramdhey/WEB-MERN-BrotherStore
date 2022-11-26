import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import Rating from "../komponen/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../komponen/LoadingBox";
import MessageBox from "./../komponen/MessageBox";
import { formatRupiah, getError } from "../utils";
import { Store } from "./../StoreNContext/Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ProductScreen = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { name } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/product/name/${name}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [name]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const TambahKeKeranjangHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/product/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Maaf , Kamu Kehabisan , kembali lagi lain waktu ya.");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={product.image_url}
            alt={product.name}
          />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReview={product.numReview}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>
              Price: {formatRupiah(product.price)}
            </ListGroup.Item>
            <ListGroup.Item>Description : {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>{formatRupiah(product.price)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">Ready Stock</Badge>
                      ) : (
                        <Badge bg="danger">Stock Habis</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={TambahKeKeranjangHandler}>
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductScreen;
