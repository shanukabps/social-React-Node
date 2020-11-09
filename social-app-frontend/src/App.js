import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import Login from "./components/Login.js/Login";
import Register from "./components/Register/Register";
import Profile from "./components/Profile.js/Profile";
import CreatePost from "./components/CreatePost/CreatePost";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateValue } from "./components/cotexApi/StateProvider";
import { Redirect } from "react-router-dom";
import Notfound from "./components/Notfound/Notfound";
import { useEffect, useState } from "react";
import SubUserPost from "./components/subUserPost/subUserPost";
import UserProfile from "./components/userProfile/UserProfile";
import { useHistory } from "react-router-dom";




//  const Routing = () => {
//     const history = useHistory();
//     const [{user}, dispatch] = useStateValue();

//     useEffect(() => {
//       const user1 = JSON.parse(localStorage.getItem("user"));
//       if (user1) {


//         dispatch({ type: "SET_USER", user: user1 });


//       } else {
//         history.push("/signin");
//       }
//     }, [user]);

//     return (
//       <Switch>
//         <Route path="/signin">
//           <Login />
//         </Route>
//         <Route path="/register">
//           <Register />
//         </Route>

//         <Route exact path="/profile">
//           <Profile />
//         </Route>

//         <Route exact path="/createpost">
//           <CreatePost />
//         </Route>
//         <Route exact path="/" component={Home} />
//         <Route path="/profile/:userid" component={UserProfile} />
//         <Route path="/mysubposts" component={SubUserPost} />
//       </Switch>
//     );
//   };














function App() {


    const [{user}, dispatch] = useStateValue();

  const user1 = JSON.parse(localStorage.getItem("user"));
 
  // console.log('app', user)
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <BrowserRouter>
       
       
        <NavBar />
    

         <Switch>

           {!user1
           ?
           <>
    <Route path="/signin">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
            <Redirect from="/" exact to="/signin" />
            <Redirect to="/signin" />
           </> 
           :
           <>
            <Route exact path="/profile">
          <Profile />
        </Route>

        <Route exact path="/createpost">
          <CreatePost />
        </Route>
        <Route exact path="/" component={Home} />
        <Route path="/profile/:userid" component={UserProfile} />
        <Route path="/mysubposts" component={SubUserPost} />
            <Redirect from="/" exact to="/signin" />
            <Redirect to="/signin" />
           </>    }
    

       
      </Switch>


      </BrowserRouter>
    </div>
  );
}

export default App;
