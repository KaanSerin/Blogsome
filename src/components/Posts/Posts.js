import React from "react";
import Post from "./Post/Post";

const Posts = ({ posts }) => {
  const output = posts.map((post) => (
    <Post key={post.id} title={post.title} body={post.body} />
  ));

  return (
    <div className="posts">
      {output.length > 0 ? output : <h2>You have no posts :(</h2>}
    </div>
  );
};

export default Posts;
