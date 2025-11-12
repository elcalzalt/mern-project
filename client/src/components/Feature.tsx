
import { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { Todo } from "./Todo";
import "./Feature.css";
import type { TodoType } from "./Todo";
import { API_BASE_URL } from "../config";

type TodosByDate = {
  [date: string]: TodoType[];
};

export default function Feature() {
  const [quote, setQuote] = useState("Loading motivation...");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [todosByDate, setTodosByDate] = useState<TodosByDate>({});
  const [hpByDate, setHpByDate] = useState<{ [date: string]: number }>({});

  const quotes = [
    "Push yourself, because no one else is going to do it for you.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "Great things never come from comfort zones.",
    "Success doesn’t just find you. You have to go out and get it.",
    "The harder you work for something, the greater you’ll feel when you achieve it.",
    "Dream it. Wish it. Do it.",
    "Don’t wait for opportunity. Create it.",
    "Sometimes later becomes never. Do it now.",
    "Little things make big days.",
    "It’s going to be hard, but hard does not mean impossible.",
    "Don’t watch the clock; do what it does. Keep going.",
    "The key to success is to focus on goals, not obstacles.",
    "The only way to achieve the impossible is to believe it is possible.",
    "Do something today that your future self will thank you for.",
    "Success is not for the lazy.",
    "Failure is the condiment that gives success its flavor.",
    "Your limitation—it’s only your imagination.",
    "Push yourself because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Wake up with determination. Go to bed with satisfaction.",
  ];
  const API_BASE = `${API_BASE_URL}/api/todo`;
  useEffect(() => {
    const fetchAllTodos = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("Fetched todos:", data);
        if (res.ok) {
          const grouped: TodosByDate = {};
          for (const t of data) {
            const date = t.date;
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push({
              id: t._id,
              text: t.text,
              exercise: t.exercise,
              weight: t.weight,
              sets: t.sets,
              reps: t.reps,
              rating: t.rating,
              done: t.checked,
              date: t.date,
            });
          }
          setTodosByDate(grouped);
          if (grouped) {
            // optionally set selectedDay to today to trigger color
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(
              today.getMonth() + 1
            ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            setSelectedDate(todayStr);
          }
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Failed to fetch all todos:", err);
      }
    };

    fetchAllTodos();
  }, []);

  useEffect(() => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random);
  }, []);

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
        // ✅ Save HP value (if backend includes hpRemaining)
        setHpByDate((prev) => ({
          ...prev,
          [dateStr]: data.hpRemaining ?? 2,
        }));
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
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

      <div className="todo">
        {selectedDate ? (
          <Todo
            todos={todosByDate[selectedDate] || []}
            onChange={(newTodos) => updateTodosForDate(selectedDate, newTodos)}
            selectedDate={selectedDate}
            hpRemaining={hpByDate[selectedDate] ?? 2}
            setHpRemaining={(newValue) =>
              setHpByDate((prev) => ({
                ...prev,
                [selectedDate]: newValue ?? 2,
              }))
            }
          />
        ) : (
          <p>Please select a date from the calendar.</p>
        )}
      </div>

      <div className="calendar">
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          todosByDate={todosByDate}
        />
      </div>
    </div>
  );
}
