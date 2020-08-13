import React, { useEffect, useReducer, useCallback } from "react";
import "./main.scss";
import Posts from "./components/Posts/Posts";
import NewPost from "./components/NewPost/NewPost";
import { Switch, Route, useHistory } from "react-router-dom";
import uuid from "uuid/dist/v4";
import Navbar from "./components/Navbar/Navbar";
import AuthenticationForm from "./components/Authentication/AuthenticationForm";
import axios from "axios";
import Logout from "./components/Authentication/Logout";
import { postsReducer } from "./Reducers/postsReducer";
import { authenticationReducer } from "./Reducers/authenticationReducer";
import FullPost from "./components/Posts/FullPost/FullPost";

function App() {
  const [postsState, dispatch] = useReducer(postsReducer, {
    isLoading: false,
    posts: [],
  });

  const [authenticationState, dispatchAuth] = useReducer(
    authenticationReducer,
    {
      isAuthenticated: false,
      authenticationData: null,
    }
  );

  const history = useHistory();

  const addPostHandler = (title, body) => {
    const newPosts = [
      ...postsState.posts,
      {
        id: uuid(),
        title,
        body,
      },
    ];

    axios
      .put(
        `https://blogsome-f30d4.firebaseio.com/users/${authenticationState.authenticationData.localId}/posts.json`,
        newPosts
      )
      .then(() => dispatch({ type: "UPDATE_POSTS", value: newPosts }))
      .catch((error) => console.log(error.message));
  };

  const deletePostHandler = (postId) => {
    const postsFiltered = postsState.posts.filter((post) => post.id !== postId);

    dispatch({ type: "UPDATE_POSTS", value: postsFiltered });

    axios
      .put(
        `https://blogsome-f30d4.firebaseio.com/users/${authenticationState.authenticationData.localId}/posts.json`,
        postsFiltered
      )
      /*.then(() => dispatch({ type: "UPDATE_POSTS", value: postsFiltered }))*/
      .catch((error) => console.log(error.message));
  };

  const onAuthenticationHandler = (data) => {
    dispatchAuth({ type: "LOGIN", value: data });

    setTimeout(() => {
      console.log("expired getting new token");
      onLogoutHandler();
    }, +data.expiresIn * 1000);

    history.push("/my-posts");
  };

  const onLogoutHandler = () => {
    localStorage.removeItem("userData");
    dispatchAuth({ type: "LOGOUT" });
    dispatch({ type: "CLEAR_POSTS" });
  };

  const getPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://blogsome-f30d4.firebaseio.com/users/${authenticationState.authenticationData.localId}/posts.json`
      );
      dispatch({ type: "UPDATE_POSTS", value: response.data });
    } catch (error) {
      console.log(error);
    }
  }, [authenticationState.isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData !== null) {
      if (new Date() < new Date(userData.expireDate)) {
        dispatchAuth({ type: "LOGIN", value: userData });
      } else {
        onLogoutHandler();
      }
    }

    if (authenticationState.isAuthenticated) {
      dispatch({ type: "SET_LOADING" });
      getPosts();
    }
  }, [authenticationState.isAuthenticated, getPosts]);

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
        <Route path="/my-posts/post" exact>
          <FullPost posts={postsState.posts} />
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
      {authenticationState.isAuthenticated ? <Navbar /> : null}
      {routes}
    </div>
  );
}

export default App;
