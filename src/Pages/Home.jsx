import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import "../Styles/Home.css";

function Home() {
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [workoutData, setWorkoutData] = useState([]); // Add this line to store fetched data

  const fetchWorkouts = async () => {
    try {
      const response = await fetch("/fitness_tracker");
      if (response.ok) {
        const jsonResponse = await response.json();
        setWorkoutData(jsonResponse.data); // Assuming 'data' is your array of workouts
      } else {
        console.error("Failed to fetch workouts");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behaviour

    // Data to be sent to the server
    const workoutData = { exercise, sets, reps, weight };

    try {
      const response = await fetch("/fitness_tracker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workoutData),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse.message);
        // Reset form or provide further user feedback

        // Resetting the input fields to their initial state
        setExercise("");
        setSets("");
        setReps("");
        setWeight("");

        fetchWorkouts(); // Re-fetch workouts after successful addition
        alert("Submitted");
      } else {
        console.error("Failed to save workout data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    // Assume `id` is passed to this function
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this workout?")) {
      return; // Stop the function if the user cancels the action
    }

    try {
      const response = await fetch(`/fitness_tracker/${id}`, {
        // Use template literals to embed the id
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        // Removed body as it's typically not needed for DELETE requests
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse.message);
        fetchWorkouts(); // Re-fetch workouts after successful deletion
        alert("Workout deleted successfully.");
      } else {
        console.error("Failed to delete workout data");
        alert("Failed to delete workout.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the workout.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/fitness_tracker");
        if (response.ok) {
          const jsonResponse = await response.json();
          setWorkoutData(jsonResponse.data); // Assuming 'data' contains the workout data array
        } else {
          console.error("Failed to fetch workout data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []); // The empty array ensures this effect runs once on component mount

  return (
    <div className="home-background">
      <h1>Lonewolf Fitness</h1>
      <div className="workout-tracker">
        <form onSubmit={handleSubmit}>
          <legend>Workout Tracker</legend>

          <div className="form-row">
            <label>Exercise:</label>
            <input
              type="text"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Set(s):</label>
            <input
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Reps:</label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Weight (LBS):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* New section for displaying fetched data */}
      <div className="workout-data">
        <h2>Workout Records</h2>
        {workoutData.length > 0 ? (
          <ul>
            {workoutData.map((record) => (
              <li key={record.id}>
                Date: {new Date(record.date).toLocaleDateString()}, Exercise:{" "}
                {record.exercise}, Set(s): {record.sets}, Reps:{" "}
                {/* This code snippet converts the date string into a Date object and then to a locale-specific date string. */}
                {record.reps}, Weight: {record.weight} LBS,{" "}
                <button
                  onClick={() => handleDelete(record.id)}
                  className="dataDeleteBtn"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No workout records found.</p>
        )}
      </div>
      <div className="trackerBtns">
        <button className="signOutBtn" onClick={handleSignOut}>
          Sign Out
        </button>
        <Link  to={"/FoodTracker"}>
          <button className="foodTrackerBtn">Food Tracker</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
