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
        const { data } = await axios.get(`https://web-brotherstore.onrender.com/order/mine`, {
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
        <title >Riwayat Order</title>
      </Helmet>

      <h1 className="txt">Riwayat Transaksi</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <Table striped bordered hover size="sm">
          <thead className="txt">
            <tr className="txt">
              <th className="txt">ID Order</th>
              <th className="txt">Date</th>
              <th className="txt">Pembayaran</th>
              <th className="txt">Pengiriman</th>
              <th className="txt">Total Belanja</th>
              <th className="txt">Aksi</th>
            </tr>
          </thead>
          <tbody className="txt">
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
