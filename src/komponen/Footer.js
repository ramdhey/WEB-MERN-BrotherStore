import { Container,Row,Col } from "react-bootstrap"


export const Footer = () =>{
    return(
        <footer className="footer"> 
        <Container>
            <Row className="align-item-center">
                
                
                <Col sm={6} className="text-center text-sm-end" style={{ width: '300px' , margin: 'auto'}}>
                    <p>&copy; 2022 Rama Dhea Yudhistira</p>
                </Col>

            </Row>
        </Container>

        </footer>
    )
}