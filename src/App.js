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
  const [posts, setPosts] = useState([]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticationData, setAuthenticationData] = useState(null);

  const history = useHistory();

  const addPostHandler = (title, body) => {
    const newPost = {
      id: uuid(),
      title,
      body,
    };
    const newPosts = [...posts, newPost];
    axios
      .put(
        `https://blogsome-f30d4.firebaseio.com/posts/${authenticationData.localId}.json`,
        newPosts
      )
      .then((response) => setPosts(newPosts))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (isAuthenticated) {
      // get posts
      axios
        .get(
          `https://blogsome-f30d4.firebaseio.com/posts/${authenticationData.localId}.json`
        )
        .then((response) => {
          console.log(response.data);
          setPosts(response.data);
        })
        .catch((error) => console.log(error));
    }
  }, [isAuthenticated]);

  const onAuthenticationHandler = (data) => {
    setAuthenticationData(data);
    setIsAuthenticated(true);
    history.push("/my-posts");
  };

  return (
    <div className="App">
      <h1>Bloggerly...</h1>

      {isAuthenticated ? <Navbar isAuthenticated={isAuthenticated} /> : null}

      <Switch>
        <Route path="/new-post">
          <NewPost addPost={addPostHandler} />
        </Route>
        <Route path="/my-posts" exact>
          <Posts posts={posts} />
        </Route>
        <Route path="/" exact>
          <AuthenticationForm onAuthenticated={onAuthenticationHandler} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
