import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { Todo } from "./Todo";

import "./Feature.css";
export default function Feature() {
  const [quote, setQuote] = useState("Loading motivation...");
 const [selectedDate, setSelectedDate] = useState<string | null>(null); 
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

  useEffect(() => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random); // <-- important! updates state
  }, []); // runs once when component mounts

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    console.log("Selected date:", dateStr);
  };


  return (
    <>
      <div className="container">
        <div className="quote">
          <span>"{quote}"</span>
        </div>
        <div className="todo">
          <Todo></Todo>
        </div>
        <div className="calendar">
          <Calendar
            selectedDate={selectedDate}       // <-- pass state
            onDateSelect={handleDateSelect}   // <-- pass handler
          />
        </div>
      </div>
    </>
  );
}
