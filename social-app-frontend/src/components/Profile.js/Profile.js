import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useStateValue } from "./../cotexApi/StateProvider";
import { toast } from "react-toastify";
import axios from "../../axios";

function Profile() {
  const [data, setdata] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [image, setImage] = useState();
  const [url, setUrl] = useState();
  //console.log(user)
  //console.log('data',data)

  const headers = {
    "Content-Type": "application/json",
    "x-auth-token": localStorage.getItem("jwt"),
  };

  useEffect(() => {
    // axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("jwt");
    axios
      .get("/mypost", { headers })
      .then((req) => {
        // console.log(req.data);
        setdata(req.data.myposts);
      })
      .catch((e) => {
        if (e.response && e.response.data) {
          toast.error(e.response.data); // some reason error message
        } else {
          console.log(e.message);
          toast.error("Network Error");
        }
      });
  }, []);

  const uploadPhoto = async () => {
    let formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", "social-App");
    formData.append("cloud_name", "dcfrl1b41");

    await axios
      .post("https://api.cloudinary.com/v1_1/dcfrl1b41/image/upload", formData)
      .then((req) => {
        //  console.log(req.data.url);
        toast.success("Image Post Save");
        setUrl(req.data.url);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, pic: req.data.url })
        );

        dispatch({
          type: "UPDATEPIC",
          user: {
            pic: req.data.url,
          },
        });

        axios
          .put("/updatepic", { pic: url }, { headers })
          .then((req) => {
            console.log(req.data);
          })
        
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

  // console.log("imag", image);

  return (
    <div className="profile">
      <div className="profile_header">
        <div className="profile_image">
          <img className="profile_pic" src={user ? user.pic : "Loding"} />
          <button
            className="button"
            onClick={() => uploadPhoto()}
            type="submit"
          >
            Change Your Image
          </button>
          <div className="input custominput">
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
        </div>
        <div className="profile_details">
          <h4>{user.name}</h4>
          <h6>{user.email}</h6>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "40vw",
            }}
            className="profile_rating"
          >
            <h5>{data.length} Posts</h5>
            <h5>{user.followers.length} followers</h5>
            <h5>{user.following.length} following</h5>
          </div>
        </div>
      </div>

      {data.map((img) => {
        return (
          <div className="profile_gallery">
            <img className="gallery_item" src={img.photo} alt="item" />
          </div>
        );
      })}
    </div>
  );
}

export default Profile;
