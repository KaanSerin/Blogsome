import React, { useState } from "react";
import "./main.scss";
import Posts from "./components/Posts/Posts";
import NewPost from "./components/NewPost/NewPost";
import { Switch, Route, NavLink } from "react-router-dom";
import uuid from "uuid/dist/v4";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const [posts, setPosts] = useState([
    { id: 1, title: "First Post", body: "This is my first blog post!" },
    { id: 2, title: "Another Post", body: "This is my only other post!" },
  ]);

  const addPostHandler = (title, body) => {
    const newPost = {
      id: uuid(),
      title,
      body,
    };

    setPosts([...posts, newPost]);
  };

  return (
    <div className="App">
      <h1>Bloggerly...</h1>

      <Navbar />

      <Switch>
        <Route path="/new-post">
          <NewPost addPost={addPostHandler} />
        </Route>
        <Route path="/" exact>
          <Posts posts={posts} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
