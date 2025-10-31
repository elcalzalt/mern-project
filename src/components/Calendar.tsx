import React from "react";
import "./Calendar.css";

const CalendarArea = () => {
  // Current date
  const today: Date = new Date();
  const year: number = today.getFullYear();
  const month: number = today.getMonth();

  // Number of days in current month
  const daysInMonth: number = new Date(year, month + 1, 0).getDate();
  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Weekday headers
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // Weekday of the 1st day of the month (0 = Sunday)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Create calendar grid with empty slots before the 1st day
  const days: (number | null)[] = [
    ...Array.from({ length: firstDayIndex }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="calendarWrapper">
      {/* Header */}
      <div className="calendarHeader">
        <h2>
          {monthNames[month]} {year}
        </h2>
      </div>

      {/* Weekdays Row */}
      <div className="calendarWeekdays">
        {weekdays.map((day) => (
          <div key={day} className="calendarWeekday">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="calendarGrid">
        {days.map((day, i) => (
          <div
            key={i}
            className={`calendarDay ${day === today.getDate() ? "today" : ""}`}
          >
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
};
export default CalendarArea;
