export const postsReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_POSTS":
      return {
        isLoading: false,
        posts: action.value ? action.value : [],
      };

    case "CLEAR_POSTS":
      return {
        isLoading: false,
        posts: [],
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: true,
      };

    default:
      return state;
  }
};
