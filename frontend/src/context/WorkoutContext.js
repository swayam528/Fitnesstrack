import { createContext, useReducer } from "react";

export const WorkoutsContext = createContext();

export const workoutsReducer = (state, action) => {
  console.log("Workouts Reducer:", action.type, action.payload);

  switch (action.type) {
    case "SET_WORKOUTS":
      console.log("Setting workouts to:", action.payload);
      return {
        workouts: action.payload,
      };
    case "CREATE_WORKOUT":
      console.log("Creating workout:", action.payload);
      return {
        workouts: [action.payload, ...state.workouts],
      };
    case "DELETE_WORKOUT":
      console.log("Deleting workout:", action.payload._id);
      return {
        workouts: state.workouts.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const WorkoutsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutsReducer, {
    workouts: null,
  });

  console.log("Workouts Context State:", state);

  return (
    <WorkoutsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkoutsContext.Provider>
  );
};
