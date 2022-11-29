import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatRupiah } from "../utils";
import Rating from "./Rating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "./../StoreNContext/Store";

function Product(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartinCardHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
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

  const { product } = props;
  return (
    <Card className="product" style={{height:'600px'}}>
      <Link to={`/product/${product.name}`}>
        <img
          className="card-img-top"
          src={product.image_url}
          alt={product.name}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.name}`}>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{formatRupiah(product.price)}</Card.Text>
          <Rating rating={product.rating} numReview={product.numReview} />
        </Link>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Stok Barang Habis
          </Button>
        ) : (
          <Button onClick={() => addToCartinCardHandler(product)}>
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
