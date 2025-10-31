import React from "react";
import Calendar from "./Calendar"
import "./Feature.css";
export default function Feature() {
  return (
    <>
      <div className="container">
        <div className="quote"></div>
        <div className="todo"></div>
        <div className="calendar">
          <Calendar/>
        </div>
      </div>
    </>
  );
}
