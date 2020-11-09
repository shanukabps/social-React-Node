import React, { useState } from "react";
import "../Register/Register.css";
import axios from "../../axios";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useStateValue } from "../cotexApi/StateProvider";

function Login() {
  const history = useHistory();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [{}, dispatch] = useStateValue();
  const [image, setImage] = useState();

  const handelSiginIn = async (e) => {
    e.preventDefault();

    await axios
      .post("/signin", { email: email, password: password })
      .then((req) => {
        // console.log(req.data)

        localStorage.setItem("jwt", req.data.newtoken);
        localStorage.setItem("user", JSON.stringify(req.data.user));

        if (req.data.user) {
          dispatch({
            type: "SET_USER",
            user: req.data.user,
          });
        } else {
          dispatch({
            type: "SET_USER",
            user: null,
          });
        }

        toast.success("WelCome To Social ");
        setPassword("");
        setEmail("");
        history.replace("/");
      })
      .catch((e) => {
        if (e.response && e.response.data) {
          toast.error(e.response.data); // some reason error message
        } else {
          toast.error("Network Error Refresh ");
          console.log(e);
        }
      });
  };

  return (
    <div className="login">
      <div className="card">
        <h2>Social Merchandise</h2>

        <div className="input">
          <input
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="b">
          <button
            className="button"
            disabled={email === "" || password === ""}
            type="submit"
            onClick={handelSiginIn}
          >
            SIGNIN
          </button>
        </div>
        <div className="link">
          <Link className="link" to="./register">
            {" "}
            <h3>Don't have an account</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
