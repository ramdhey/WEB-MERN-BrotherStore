import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
// import data from "./../dummydata";
import axios from "axios";

import { Col, Row } from "react-bootstrap";
import Product from "./../komponen/product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../komponen/LoadingBox";
import MessageBox from "../komponen/MessageBox";
import { getError } from "../utils";

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

const Home = () => {
  // const [product,setproduct] = useState([])
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/product");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }

      // setproduct(result.data)
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Brother Store</title>
      </Helmet>
      <h1 className="label">My product</h1>

      <div className="products main">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {
            product.map((product) => (
              
              <Col key={product._id} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Home;
