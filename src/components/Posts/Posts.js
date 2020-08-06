import React from "react";
import Post from "./Post/Post";
import { Spinner } from "reactstrap";

const Posts = ({ posts, isLoading }) => {
  const postList = posts.map((post) => (
    <Post key={post.id} title={post.title} body={post.body} />
  ));

  let output = postList.length > 0 ? postList : <h3>You have no posts :(</h3>;

  if (isLoading) {
    output = <Spinner color="primary" />;
  }

  return <div className="posts">{output}</div>;
};

export default Posts;
