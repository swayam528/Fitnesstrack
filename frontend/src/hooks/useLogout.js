import { useAuthContext } from "./useAuthContext";
import { useWorkoutsContext } from "./useWorkoutsContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: dispatchWorkouts } = useWorkoutsContext();

  const logout = () => {
    console.log("Logging out, clearing workouts and user data");

    // remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });

    // Clear workouts from context
    dispatchWorkouts({ type: "SET_WORKOUTS", payload: null });
    console.log("Logout complete, workouts cleared");
  };

  return { logout };
};
