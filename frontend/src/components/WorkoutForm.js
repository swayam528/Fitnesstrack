import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }
    const workout = { title, weight, reps };
    try {
      const response = await fetch("http://localhost:4000/api/workouts", {
        method: "POST",
        body: JSON.stringify(workout),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        // Make sure emptyFields is always an array
        setEmptyFields(Array.isArray(json.emptyFields) ? json.emptyFields : []);
      } else {
        setEmptyFields([]);
        setError(null);
        setTitle("");
        setWeight("");
        setReps("");
        dispatch({ type: "CREATE_WORKOUT", payload: json });
      }
    } catch (err) {
      console.error("Error submitting workout:", err);
      setError("Failed to connect to server. Please try again.");
      setEmptyFields([]);
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Exercise Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields?.includes("title") ? "error" : ""}
      />

      <label>Weight (in lbs):</label>
      <input
        type="number"
        onChange={(e) => setWeight(e.target.value)}
        value={weight}
        className={emptyFields?.includes("weight") ? "error" : ""}
      />

      <label>Number of Reps:</label>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields?.includes("reps") ? "error" : ""}
      />

      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
