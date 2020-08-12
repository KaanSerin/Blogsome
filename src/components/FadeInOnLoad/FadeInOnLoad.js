import React from "react";
import styled from "styled-components";

const FadeInDiv = styled.div`
  animation: 300ms ease-in fadeIn;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const FadeInOnLoad = (props) => {
  return <FadeInDiv>{props.children}</FadeInDiv>;
};

export default FadeInOnLoad;
