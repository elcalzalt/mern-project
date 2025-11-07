// import React, { useEffect, useState } from "react";
// import Calendar from "./Calendar";
// import { Todo } from "./Todo";
// import { useNavigate } from "react-router-dom";
// import "./Feature.css";
// export default function Feature() {
//   const [quote, setQuote] = useState("Loading motivation...");
//  const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const quotes = [
//     "Push yourself, because no one else is going to do it for you.",
//     "Don’t stop when you’re tired. Stop when you’re done.",
//     "Great things never come from comfort zones.",
//     "Success doesn’t just find you. You have to go out and get it.",
//     "The harder you work for something, the greater you’ll feel when you achieve it.",
//     "Dream it. Wish it. Do it.",
//     "Don’t wait for opportunity. Create it.",
//     "Sometimes later becomes never. Do it now.",
//     "Little things make big days.",
//     "It’s going to be hard, but hard does not mean impossible.",
//     "Don’t watch the clock; do what it does. Keep going.",
//     "The key to success is to focus on goals, not obstacles.",
//     "The only way to achieve the impossible is to believe it is possible.",
//     "Do something today that your future self will thank you for.",
//     "Success is not for the lazy.",
//     "Failure is the condiment that gives success its flavor.",
//     "Your limitation—it’s only your imagination.",
//     "Push yourself because no one else is going to do it for you.",
//     "Great things never come from comfort zones.",
//     "Wake up with determination. Go to bed with satisfaction.",
//   ];

//   useEffect(() => {
//     const random = quotes[Math.floor(Math.random() * quotes.length)];
//     setQuote(random); // <-- important! updates state
//   }, []); // runs once when component mounts

//   const handleDateSelect = (dateStr: string) => {
//     setSelectedDate(dateStr);
//     console.log("Selected date:", dateStr);
//   };
//   const navigate = useNavigate();
// // 🚪 Logout handler
//   const handleLogout = () => {
//     localStorage.removeItem("token"); // clear token
//     navigate("/"); // redirect to home/login
//   };

//   return (
//     <>
//       <div className="container">
//         <button className="logout-btn" onClick={handleLogout}>
//           Logout
//         </button>
//         <div className="quote">
//           <span>"{quote}"</span>
//         </div>
//         <div className="todo">
//           <Todo></Todo>
//         </div>
//         <div className="calendar">
//           <Calendar
//             selectedDate={selectedDate}       // <-- pass state
//             onDateSelect={handleDateSelect}   // <-- pass handler
//           />
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { Todo } from "./Todo";
import "./Feature.css";
import { useNavigate } from "react-router-dom";
import type { TodoType } from "./Todo";

// type TodoType = {
//   id: number;
//   exercise: string;
//   text: string; // exercise name
//   weight: string;
//   sets: number;
//   reps: number;
//   rating: number;
//   done: boolean;
//   date?: string;
// };

type TodosByDate = {
  [date: string]: TodoType[];
};

export default function Feature() {
  const [quote, setQuote] = useState("Loading motivation...");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [todosByDate, setTodosByDate] = useState<TodosByDate>({});
  const navigate = useNavigate();

  const quotes = [
    "Push yourself, because no one else is going to do it for you.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "Great things never come from comfort zones.",
    "Success doesn’t just find you. You have to go out and get it.",
  ];

  useEffect(() => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random);
  }, []);
  const API_BASE = "http://localhost:5050/api/todo";
  const handleDateSelect = async (dateStr: string) => {
    setSelectedDate(dateStr);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(dateStr)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTodosByDate((prev) => ({
          ...prev,
          [dateStr]: data.map((t: any) => ({
            id: t._id, // backend uses _id
            text: t.text,
            exercise: t.exercise,
            weight: t.weight,
            sets: t.sets,
            reps: t.reps,
            rating: t.rating,
            done: t.checked,
            date: t.date,
          })),
        }));
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Add or delete todos for specific date
  const updateTodosForDate = (date: string, newTodos: TodoType[]) => {
    setTodosByDate((prev) => ({
      ...prev,
      [date]: newTodos,
    }));
  };

  return (
    <div className="container">
      <div className="quote">
        <span>"{quote}"</span>
      </div>

      <button className="logoutBtn" onClick={handleLogout}>
        Logout
      </button>

      <div className="todo">
        {selectedDate ? (
          <Todo
            todos={todosByDate[selectedDate] || []}
            onChange={(newTodos) => updateTodosForDate(selectedDate, newTodos)}
            selectedDate={selectedDate}
          />
        ) : (
          <p>Please select a date from the calendar.</p>
        )}
      </div>

      <div className="calendar">
        <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
      </div>
    </div>
  );
}
