import React from "react";
import Calendar from "./Calendar"
import {Todo} from "./Todo"

import "./Feature.css";
export default function Feature() {
  return (
    <>
      <div className="container">
        <div className="quote">
            <span>random quotes</span>
        </div>
        <div className="todo">
          <Todo></Todo>
        </div>
        <div className="calendar">
          <Calendar/>
        </div>
      </div>
    </>
  );
}
