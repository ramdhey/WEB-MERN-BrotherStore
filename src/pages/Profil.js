import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "./../StoreNContext/Store";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { useReducer } from "react";
import { toast } from "react-toastify";
import { getError } from "./../utils";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };

    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function Profil() {
 
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [password, setPasword] = useState("");

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/user/profil',
        {
          name,
          password
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({ type: "USER_LOGIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Update Data Berhasil");
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
      });

      toast.error(getError(err));
    }
  };
  return (
    <div className="container small-container">
      <Helmet>Profil</Helmet>

      <h1 className="my-3">Profil</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="nama">
          <Form.Label>FullName</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ubah Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password"
            placeholder="Ubah Password"
            value={password}
            onChange={(e) => setPasword(e.target.value)}
          />
        </Form.Group>

        <div>
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </div>
  );
}
