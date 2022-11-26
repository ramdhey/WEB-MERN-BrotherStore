import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../komponen/LoadingBox";
import MessageBox from "../komponen/MessageBox";
import { Store } from "./../StoreNContext/Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatRupiah, getError } from "./../utils";
import { Button, Table } from 'react-bootstrap';

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, order: action.payload, loading: false };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function HistoryOrder() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/order/mine`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData()
  },[userInfo]);

  return (
    <div>
      <Helmet>
        <title>Riwayat Order</title>
      </Helmet>

      <h1>Riwayat Transaksi</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID Order</th>
              <th>Date</th>
              <th>Pembayaran</th>
              <th>Pengiriman</th>
              <th>Total Belanja</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {order.map((order)=>(
                <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0,10)}</td>
                    
                    <td>{order.isPaid ? order.paidAt.substring(0,10): 'No'}</td>
                    <td>{order.isDelivered ? order.deliveredAt.substring(0,10): 'No'}</td>
                    <td>{formatRupiah(order.totalPrice)}</td>
                    <td><Button type="button" variant="light" onClick={()=>{navigate(`/order/${order._id}`)}}>Details</Button></td>
                </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
