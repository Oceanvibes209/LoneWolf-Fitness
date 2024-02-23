import { Link } from "react-router-dom";
import "../Styles/FoodTracker.css";
import { useState, useEffect } from "react";

function FoodTracker() {
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [foodLog, setFoodLog] = useState([]); // Add this line to store fetched data

  const handleFoodSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    console.log("Form submission triggered"); // Add this line

    // Data to be sent to the server
    const foodLog = { food, calories, protein, fat, carbs };

    try {
      const response = await fetch("/food_tracker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(foodLog),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse.message);
        // Reset form or provide further user feedback

        // Resetting the input fields to their initial state
        setFood("");
        setCalories("");
        setProtein("");
        setFat("");
        setCarbs("");

        fetchFoodData(); // Re-fetch workouts after successful addition
        alert("Submitted");
      } else {
        console.error("Failed to save food data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchFoodData = async () => {
    try {
      const response = await fetch("/food_tracker");
      if (response.ok) {
        const jsonResponse = await response.json();
        setFoodLog(jsonResponse.data); // Assuming 'data' is your array of workouts
      } else {
        console.error("Failed to fetch food log");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    // Assume `id` is passed to this function
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this food log?")) {
      return; // Stop the function if the user cancels the action
    }

    try {
      const response = await fetch(`/food_tracker/${id}`, {
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
        fetchFoodData(); // Re-fetch food data after successful deletion
        alert("Food Log deleted successfully.");
      } else {
        console.error("Failed to delete Food Log");
        alert("Failed to delete Food Log.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the Food Log.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/food_tracker");
        if (response.ok) {
          const jsonResponse = await response.json();
          setFoodLog(jsonResponse.data); // Assuming 'data' contains the workout data array
        } else {
          console.error("Failed to fetch food log data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []); // The empty array ensures this effect runs once on component mount

  return (
    <div className="foodTrackerBackground">
      <Link to={"/Home"}>Home</Link>

      <div className="food-tracker">
        <form onSubmit={handleFoodSubmit}>
          <legend>Food Log</legend>

          <div className="form-row">
            <label>Food:</label>
            <input
              type="text"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Calories:</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Protein (grams):</label>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Fat (grams):</label>
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Carbs (grams):</label>
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              required
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
      {/* New section for displaying fetched data */}
      <div className="food-data">
        <h2>Food Records</h2>
        {foodLog.length > 0 ? (
          <ul>
            {foodLog.map((record) => (
              <li key={record.id}>
                Date: {new Date(record.date).toLocaleDateString()}{/* This code snippet converts the date string into a Date object and then to a locale-specific date string. */},
                 Food: {record.food}, Calories: {record.calories}, Protein (grams):{record.protein}, Fat (grams): {record.fat}, Carbs (grams): {record.carbs},  
                <button onClick={() => handleDelete(record.id)} className="dataDeleteBtn">x</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No food records found.</p>
        )}
      </div>
    </div>
  );
}

export default FoodTracker;
