import { useEffect, useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(
      "Home component rendered, user:",
      user ? "logged in" : "not logged in"
    );
    console.log("Current workouts state:", workouts);

    const fetchWorkouts = async () => {
      if (!user) {
        console.log("No user, skipping workout fetch");
        return;
      }

      console.log("Fetching workouts...");
      setIsLoading(true);
      setError(null);

      try {
        console.log(
          "Making API request with token:",
          user.token.substring(0, 10) + "..."
        );

        const response = await fetch("http://localhost:4000/api/workouts", {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await response.json();
        console.log("API response:", response.status, response.ok);
        console.log("Workouts data received:", json);

        if (!response.ok) {
          console.error("Error fetching workouts:", json.error);
          setError(json.error || "Failed to fetch workouts");
        } else {
          console.log("Dispatching SET_WORKOUTS with data:", json);
          dispatch({ type: "SET_WORKOUTS", payload: json });
          setError(null);
        }
      } catch (err) {
        console.error("Network error while fetching workouts:", err);
        setError("Network error: Could not connect to server");
      } finally {
        setIsLoading(false);
      }
    };

    // Always fetch workouts when user is logged in
    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

  // Log when workouts change
  useEffect(() => {
    console.log("Workouts updated in component:", workouts);
  }, [workouts]);

  return (
    <div className="home">
      <div className="workouts">
        {error && <div className="error">{error}</div>}
        {isLoading && <div className="loading">Loading workouts...</div>}
        {!isLoading && workouts && workouts.length === 0 && (
          <div className="no-workouts">
            No workouts yet! Add your first one.
          </div>
        )}
        {workouts &&
          workouts.map((workout) => (
            <WorkoutDetails key={workout._id} workout={workout} />
          ))}
      </div>
      <WorkoutForm />
    </div>
  );
};

export default Home;
