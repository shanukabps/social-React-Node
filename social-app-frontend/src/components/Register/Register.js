import React, { useEffect, useState } from "react";
import "./Register.css";
import { Link, useHistory } from "react-router-dom";
import axios from "../../axios";
import { toast } from "react-toastify";
//import Joi from 'joi'

function Register() {


  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState();
  const [url, setUrl] = useState();
  //console.log('ccc', email == '')


useEffect(() => {
   if(url){
       uploadFields()
   }


}, [url])





const uploadFields= async()=>{
 await axios
      .post("/register", { name: name, password: password, email: email,pic:url })
      .then((req) => {
        console.log(req.data);
        toast.success("Successfully Registered");
        setName("");
        setPassword("");
        setEmail("");
        history.replace("/signin");
      })
      .catch((e) => {
        if (e.response && e.response.data) {
          toast.error(e.response.data); // some reason error message
        } else {
          toast.error("Network Error");
        }
      });

}




 const uploadpic = async () => {
    let formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", "social-App");
    formData.append("cloud_name", "dcfrl1b41");

    await axios
      .post("https://api.cloudinary.com/v1_1/dcfrl1b41/image/upload", formData)
      .then((req) => {
        // console.log(req.data.url);
        toast.success("Image Post Save");
        setUrl(req.data.url);
       
      })
      .catch((e) => {
        if (e.response && e.response.data) {
          toast.error(e.response.data.error.message); // some reason error message // some reason error message
          console.log("body pst", e.response.data.error.message);
        } else {
          toast.error("Network Error");
          console.log("ad", e);
        }
      });
  };





  const handelRegister = async () => {
   if(image){
       uploadpic()
   }else{
       uploadFields()
   }
  };

 
  return (
    <div className="register">
      <div className="card">
        <h2>Social Merchandise</h2>

        <div className="input">
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            name=""
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name=""
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="input custominput">
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
        </div>
        <div className="b">
          <button
            disabled={email === "" || password === ""}
            className="button"
            type="submit"
            onClick={handelRegister}
          >
            SIGNUP
          </button>
        </div>
        <div className="link">
          <Link className="link" to="./signin">
            {" "}
            <h3>Already have an account</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
