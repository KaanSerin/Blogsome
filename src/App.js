import React, { useState, useEffect } from "react";
import "./main.scss";
import Posts from "./components/Posts/Posts";
import NewPost from "./components/NewPost/NewPost";
import { Switch, Route, useHistory } from "react-router-dom";
import uuid from "uuid/dist/v4";
import Navbar from "./components/Navbar/Navbar";
import AuthenticationForm from "./components/Authentication/AuthenticationForm";
import axios from "axios";

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
    setAuthenticationState({ isAuthenticated: true, authenticationData: data });
    history.push("/my-posts");
  };

  useEffect(() => {
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

  return (
    <div className="App">
      <h1>Bloggerly...</h1>

      {authenticationState.isAuthenticated ? (
        <Navbar isAuthenticated={authenticationState.isAuthenticated} />
      ) : null}

      <Switch>
        <Route path="/new-post">
          <NewPost addPost={addPostHandler} />
        </Route>
        <Route path="/my-posts" exact>
          <Posts isLoading={postsState.isLoading} posts={postsState.posts} />
        </Route>
        <Route path="/" exact>
          <AuthenticationForm onAuthenticated={onAuthenticationHandler} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
