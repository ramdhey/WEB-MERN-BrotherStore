import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../StoreNContext/Store";
import axios from "axios";

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { getError } from './../utils';
import { toast } from 'react-toastify';
import { filter } from "@chakra-ui/react";
import { Col, Row } from "react-bootstrap";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload.products,page: action.payload.page,pages: action.payload.pages,countProducts: action.payload.countProducts, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function Search() {
  const navigate = useNavigate()
  const {search} = useLocation()
  const sp = new URLSearchParams(search)
  const category = sp.get('category') || 'all'
  const query = sp.get('query') || 'all'
  const price = sp.get('price') || 'all'
  const rating = sp.get('rating') || 'all'
  const order = sp.get('order') || 'all'
  const page = sp.get('page') || 'all'
  
  const [{ loading, error, products ,pages ,countProducts }, dispatch] = useReducer(reducer, {
    
    loading: true,
    error: "",
  });

  useEffect(()=>{
    const fetchData = async() =>{
      try {
        const {data} = await axios.get(
          `/product/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        )
        dispatch({type:"FETCH_SUCCESS",payload:data})
      } catch (err) {
        dispatch({
          type:'FETCH_FAIL',
          payload:getError(error)
        })
      }
    }
    fetchData()

  },[category,error,order,page,page,price,query,rating])

  const [categori,setCategori] = useState([])
  useEffect(()=>{
    const fetchCategori = async()=>{
      try {
        const {data} = await axios.get('/product/category')
        setCategori(data)
        
      } catch (err) {
        toast.error(getError(err))
        
      }
    }
    fetchCategori()
  },[dispatch])

  const getFilterUrl = (filter)=>{
     const filterPage = filter.page || page
     const filterCategory = filter.category || category
     const filterQuery = filter.query || query
     const filterRating = filter.rating || rating
     const filterPrice = filter.price || price
     const sortOrder = filter.order || order
     return `/search&category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`
  }

  const prices = [
    {name:'$1 to $50',value:'1-50',},{name:'$51 to $200',value:'51-200',},{name:'$201 to $1000',value:'201-1000',},
  ]
  const ratings = [
    {name:'4 ',value:'1-50',},{name:'$51 to $200',value:'51-200',},{name:'$201 to $1000',value:'201-1000',},
  ]
  return  (
    <div>
      <Helmet>Search</Helmet>
      <Row>
        <Col md={3}>
          <h3> Departement </h3>
          <div>
            <ul>
              <li>
                <Link className={'all' === category ? 'text-bold' : '' } to ={getFilterUrl({category:'all'})}>
                  Lainnya
                </Link>
              </li>
              {categori.map((c)=>(
                <li key={c}>
                  <Link className={c === category ? 'text-bold' : ''}
                  to={getFilterUrl({category:c})}>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <h3> Price </h3>
          <div>
            <ul>
              <li>
                <Link className={'all' === price ? 'text-bold' : '' } to ={getFilterUrl({price:'all'})}>
                  Lainnya
                </Link>
                </li>
                {price.map((p)=>(
                <li key={c}>
                  <Link className={p === price ? 'text-bold' : ''}
                  to={getFilterUrl({price:p})}>
                    {p.name}
                  </Link>
                </li>
              ))}
                </ul>
          </div>
        </Col>
      </Row>
    </div>

      );
}
