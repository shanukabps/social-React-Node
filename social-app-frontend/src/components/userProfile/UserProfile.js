import React, { useEffect, useState } from "react";
import "../Profile.js/Profile.css";
import { useParams } from "react-router-dom";
import { useStateValue } from "./../cotexApi/StateProvider";
import { toast } from "react-toastify";
import axios from "../../axios";

function UserProfile() {
  const { userid } = useParams();


  const [myposts, setposts] = useState([]);
  // const [mypostId, setMypostId] = useState([]);
  const [userProfile, setuserProfile] = useState();
  const [{ user }, dispatch] = useStateValue();
  const [showfollowbutton, setShowfollowbutton] = useState(user?!user.following.includes(userid):true);

  //console.log('user',user)
  //console.log("dataaauser", userProfile);

  //  myposts.map(a=>{
  //      console.log(a)
  //  })
  console.log(!user.following.includes(userid))


  useEffect(() => {
    axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("jwt");
    axios
      .get(`/user/${userid}`)
      .then((req) => {
        //console.log('aaa',req);

        setposts(req.data.posts);
        setuserProfile(req.data.user);



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

  const unfollowUser = async () => {
    axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("jwt");
    await axios.put("/unfollow", { followId: userid }).then((data) => {
      console.log("sssas", data.data);
      dispatch({
        type: "UPDATE",
        user: {
          followers: data.data.followers,
          following: data.data.following,
        },
      });
      localStorage.setItem("user", JSON.stringify(data.data));

     setShowfollowbutton(true);

      // setuserProfile(data.data)
      setuserProfile((prevState) => {

        const newFollower=prevState.followers.filter(item=>item != data.data._id)
        console.log( 'swqwq',newFollower)
        return {
          ...prevState,
          followers: newFollower,
        };
      });
    });
  };

  const followUser = async () => {
    axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("jwt");
    await axios.put("/follow", { followId: userid }).then((data) => {
      console.log("sssas", data.data);
      dispatch({
        type: "UPDATE",
        user: {
          followers: data.data.followers,
          following: data.data.following,
        },
      });
      localStorage.setItem("user", JSON.stringify(data.data));
      setShowfollowbutton(false);

      setuserProfile((prev) => {
        return {
          ...prev,
          followers: [...prev.followers, data.data._id],
        };
      });
    });
  };

  return (
    <>
      {userProfile ? (
        <div className="profile">
          <div className="profile_header">
            <div className="profile_image">
              <img
                className="profile_pic"
                src={userProfile.pic}
              />
            </div>
            <div className="profile_details">
              <h4>{userProfile.name}</h4>
              <h5>{userProfile.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "40vw",
                }}
                className="profile_rating"
              >
                <h5>{myposts.length} posts</h5>
                <h5>{userProfile.followers.length} followers</h5>
                <h5>{userProfile.following.length} followig</h5>
              </div>
              {showfollowbutton ? (
                <button className="button" onClick={() => followUser()}>
                  Follow
                </button>
              ) : (
                <button className="button" onClick={() => unfollowUser()}>
                  Unfollow
                </button>
              )}
            </div>
          </div>
          {myposts.map((post) => {
            return (
              <div className="profile_gallery">
                <img className="gallery_item" src={post.photo} alt="item" />
              </div>
            );
          })}
        </div>
      ) : (
        <h2>Loding..........</h2>
      )}
    </>
  );
}

export default UserProfile;
