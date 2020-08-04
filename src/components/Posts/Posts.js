import React from "react";
import Post from "./Post/Post";

const Posts = ({ posts }) => {
  const output = posts.map((post) => (
    <Post key={post.id} title={post.title} body={post.body} />
  ));
  console.log(posts);

  return <div className="posts">{output}</div>;
};

export default Posts;
