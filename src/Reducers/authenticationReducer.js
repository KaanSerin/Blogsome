export const authenticationReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        isAuthenticated: true,
        authenticationData: action.value,
      };

    case "LOGOUT":
      return {
        isAuthenticated: false,
        authenticationData: null,
      };

    default:
      return state;
  }
};
