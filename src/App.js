import React, { useState } from "react";
import "./main.scss";
import Posts from "./components/Posts/Posts";

function App() {
  const [posts, setPosts] = useState([
    { id: 1, title: "First Post", body: "This is my first blog post!" },
    { id: 2, title: "Another Post", body: "This is my only other post!" },
  ]);

  return (
    <div className="App">
      <h1>Kaan's Sexy Blog!</h1>
      <Posts posts={posts} />
    </div>
  );
}

export default App;
