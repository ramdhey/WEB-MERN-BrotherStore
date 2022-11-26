import React from 'react'
import { Col, Row } from 'react-bootstrap'

export default function CheckOut(props) {
  return (
    <Row className="checkout-steps">
        <Col className={props.step1 ? 'active' : ''}>Login</Col>
        <Col className={props.step2 ? 'active' : ''}>Shipping</Col>
        <Col className={props.step3 ? 'active' : ''}>Pembayaran</Col>
        <Col className={props.step4 ? 'active' : ''}>Pesanan di Proses</Col>

    </Row>
  )
}
