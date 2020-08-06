import React, { useState, useEffect } from "react";
import "./main.scss";
import Posts from "./components/Posts/Posts";
import NewPost from "./components/NewPost/NewPost";
import { Switch, Route, useHistory } from "react-router-dom";
import uuid from "uuid/dist/v4";
import Navbar from "./components/Navbar/Navbar";
import AuthenticationForm from "./components/Authentication/AuthenticationForm";
import axios from "axios";
import Logout from "./components/Authentication/Logout";

function App() {
  const [postsState, setPostsState] = useState({
    isLoading: false,
    posts: [],
  });

  const [authenticationState, setAuthenticationState] = useState({
    isAuthenticated: false,
    authenticationData: null,
  });

  const history = useHistory();

  const addPostHandler = (title, body) => {
    const newPost = {
      id: uuid(),
      title,
      body,
    };
    const newPosts = [...postsState.posts, newPost];
    axios
      .put(
        `https://blogsome-f30d4.firebaseio.com/posts/${authenticationState.authenticationData.localId}.json`,
        newPosts
      )
      .then((response) => setPostsState({ isLoading: false, posts: newPosts }))
      .catch((error) => console.log(error));
  };

  const onAuthenticationHandler = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
    setAuthenticationState({ isAuthenticated: true, authenticationData: data });

    setTimeout(() => {
      console.log("expired getting new token");
      onLogoutHandler();
      // axios
      //   .post(
      //     "https://securetoken.googleapis.com/v1/token?key=AIzaSyDungJQTA_dlkQY_0pKmcMdJB5K9ZMlOFs",
      //     {
      //       grant_type: "refresh_token",
      //       refresh_token: localStorage.getItem("refreshToken"),
      //     }
      //   )
      //   .then((response) => {
      //     onAuthenticationHandler(response.data);
      //     console.log("got new token");
      //   })
      //   .catch((error) => console.log(error.message));
    }, +data.expiresIn * 1000);

    history.push("/my-posts");
  };

  const onLogoutHandler = () => {
    localStorage.removeItem("userData");
    setAuthenticationState({
      isAuthenticated: false,
      authenticationData: null,
    });

    setPostsState({
      isLoading: false,
      posts: [],
    });

    console.log("logged out");
  };

  useEffect(() => {
    if (localStorage.getItem("userData") !== null) {
      setAuthenticationState({
        isAuthenticated: true,
        authenticationData: JSON.parse(localStorage.getItem("userData")),
      });
    }

    if (authenticationState.isAuthenticated) {
      setPostsState({ ...postsState, isLoading: true });
      // get posts
      axios
        .get(
          `https://blogsome-f30d4.firebaseio.com/posts/${authenticationState.authenticationData.localId}.json`
        )
        .then((response) => {
          console.log(response.data);
          setPostsState({
            isLoading: false,
            posts: response.data ? response.data : [],
          });
        })
        .catch((error) => console.log(error));
    }
  }, [authenticationState.isAuthenticated]);

  let routes = (
    <Switch>
      <Route path="/" exact>
        <AuthenticationForm onAuthenticated={onAuthenticationHandler} />
      </Route>
      <Route path="*">
        <h3>404 Not Found</h3>
      </Route>
    </Switch>
  );

  if (authenticationState.isAuthenticated) {
    routes = (
      <React.Fragment>
        <Navbar isAuthenticated={authenticationState.isAuthenticated} />
        <Switch>
          <Route path="/new-post">
            <NewPost addPost={addPostHandler} />
          </Route>
          <Route path="/my-posts" exact>
            <Posts isLoading={postsState.isLoading} posts={postsState.posts} />
          </Route>
          <Route path="/logout" exact>
            <Logout logout={onLogoutHandler} />
          </Route>
          <Route path="/" exact>
            <AuthenticationForm onAuthenticated={onAuthenticationHandler} />
          </Route>
          <Route path="*">
            <h3>404 Not Found</h3>
          </Route>
        </Switch>
      </React.Fragment>
    );
  }

  return (
    <div className="App">
      <h1>Bloggerly...</h1>
      {routes}
    </div>
  );
}

export default App;
