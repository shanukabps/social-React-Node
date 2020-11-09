import React, { useEffect, useState } from "react";
import "./CreatePost.css";
import axios from "../../axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

function CreatePost() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
   const headers = {
  'Content-Type': 'application/json',
  'x-auth-token': localStorage.getItem("jwt"),
};
      axios
        .post("/createpost", { title: title, body: body, photo: url },{headers})
        .then((req) => {
          // console.log(req.data)
          toast.success("Posted in wall");
          setTitle("");
          setBody("");
          setUrl("");
          setImage("");
          history.push("/");
        })
        .catch((e) => {
          if (e.response && e.response.data) {
            toast.error(e.response.data); // some reason error message
            setUrl("");
          } else {
            toast.error("Network Error Refresh the Page");
          }
        });
    }
  }, [url]);

  // console.log('aa', url)

  const postDetails = async () => {
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
        if (url) {
        }
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

  return (
    <div className="createpost">
      <div className="card post">
        <div className="input post_input">
          <input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <div className="input custominput">
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <div className="post_button">
            <button
              onClick={() => postDetails()}
              disabled={title === "" || body === ""}
              className="button"
              type="submit"
              onClick={() => postDetails()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
