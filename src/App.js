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
        `https://blogsome-f30d4.firebaseio.com/posts/${authenticationState.authenticationData.localId}/posts.json`,
        newPosts
      )
      .then((response) => setPostsState({ isLoading: false, posts: newPosts }))
      .catch((error) => console.log(error.message));
  };

  const deletePostHandler = (postId) => {
    const postsFiltered = postsState.posts.filter((post) => post.id !== postId);
    setPostsState({ ...postsState, isLoading: true });
    axios
      .put(
        `https://blogsome-f30d4.firebaseio.com/posts/${authenticationState.authenticationData.localId}/posts.json`,
        postsFiltered
      )
      .then((response) =>
        setPostsState({ isLoading: false, posts: postsFiltered })
      )
      .catch((error) => console.log(error.message));
  };

  const onAuthenticationHandler = (data) => {
    const currentDate = new Date();
    const storedData = {
      idToken: data.idToken,
      localId: data.localId,
      expireDate: currentDate.setHours(
        currentDate.getHours() + data.expiresIn / 3600
      ),
      expiresIn: data.expiresIn,
    };
    localStorage.setItem("userData", JSON.stringify(storedData));

    setAuthenticationState({
      isAuthenticated: true,
      authenticationData: storedData,
    });

    setTimeout(() => {
      console.log("expired getting new token");
      onLogoutHandler();
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

  // The componentDidMount and update
  useEffect(() => {
    // if the user has logged in before
    if (localStorage.getItem("userData") !== null) {
      // and if the stored expiration date is in the future
      if (
        new Date() <
        new Date(JSON.parse(localStorage.getItem("userData")).expireDate)
      ) {
        // authenticate
        setAuthenticationState({
          isAuthenticated: true,
          authenticationData: JSON.parse(localStorage.getItem("userData")),
        });
      } else {
        // if the expiration date is passed, logout.
        onLogoutHandler();
      }
    }

    // If the user signs up or logs in
    if (authenticationState.isAuthenticated) {
      // set Loading to true to display the spinner
      setPostsState({ ...postsState, isLoading: true });

      // get posts
      axios
        .get(
          `https://blogsome-f30d4.firebaseio.com/posts/${authenticationState.authenticationData.localId}/posts.json`
        )
        .then((response) => {
          console.log(response.data);
          // Update the posts array and stop the loading
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
      <Switch>
        <Route path="/new-post">
          <NewPost addPost={addPostHandler} />
        </Route>
        <Route path="/my-posts" exact>
          <Posts
            isLoading={postsState.isLoading}
            posts={postsState.posts}
            deletePost={deletePostHandler}
          />
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
    );
  }

  return (
    <div className="App">
      <h1>Blogsome...</h1>
      {authenticationState.isAuthenticated ? <Navbar /> : null}
      {routes}
    </div>
  );
}

export default App;
