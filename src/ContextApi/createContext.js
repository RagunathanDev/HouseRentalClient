import createDataProvider from "./createDataProvide";

const intialState = {
  user: [],
};

// const validate = (data, id) => {
//   console.log(data);
//   console.log("id : " + id);
//   return data.initial === id
//     ? { ...data, initial: data.initial + 1, create: "YES" }
//     : { ...data, create: "NO" };
// };

const globalReducer = (state = intialState, action) => {
  switch (action.type) {
    case "loginUser": {
      state = {
        ...state,
        user: action.payload,
      };
      console.log("ADDUSER" + JSON.stringify(state.user));
      return state;
    }
    case "clearUser": {
      state = {
        ...state,
        user: intialState.user,
      };
      console.log("CLear" + JSON.stringify(state.user));
      return state;
    }
    default:
      return state;
  }
};

// const signIn = (dispatch) => async ({ email, password }: any) => {
//   try {
//     const response = await trackApi.post("/signin", { email, password });
//     await AsyncStorage.setItem("token", response.data.token);
//     dispatch({ type: "signup", payload: response.data.token });
//   } catch (error) {
//     console.log(error);
//     dispatch({ type: "add_error", payload: "Oops..!! Something went wrong!!" });
//   }
// };

const addLoginUser = (dispatch) => (user) => {
  try {
    dispatch({ type: "loginUser", payload: user });
  } catch (error) {
    console.log({ error });
  }
};

const clearUser = (dispatch) => () => {
  try {
    dispatch({ type: "clearUser", payload: "" });
  } catch (error) {
    console.log({ error });
  }
};

export const { Context, Provider } = createDataProvider(
  globalReducer,
  { addLoginUser, clearUser }, //Funcions
  intialState //IntialState
);
