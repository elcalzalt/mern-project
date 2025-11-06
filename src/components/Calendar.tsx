
import React, { useState } from "react";
import "./Calendar.css";

type CalendarProps = {
  selectedDate: string | null;
  onDateSelect: (dateStr: string) => void;
};

const Calendar = ({ selectedDate, onDateSelect }: CalendarProps) => {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const days: (number | null)[] = [
    ...Array.from({ length: firstDayIndex }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Handle day click
  const onSelectDay = (day: number | null) => {
    if (day === null || day === undefined) return;
    setSelectedDay(day);

    // Build YYYY-MM-DD string
    const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    onDateSelect(dateStr);
  };

  const changeMonth = (offset: number) => {
    setMonth((prevMonth) => {
      let newMonth = prevMonth + offset;
      if (newMonth < 0) {
        setYear((prev) => prev - 1);
        newMonth = 11;
      } else if (newMonth > 11) {
        setYear((prev) => prev + 1);
        newMonth = 0;
      }
      return newMonth;
    });
  };

  const changeYear = (offset: number) => {
    setYear((prevYear) => prevYear + offset);
  };

  return (
    <div className="calendarWrapper">
      <div className="calendarHeader">
        <button className="navBtn" onClick={() => changeMonth(-1)}>‹</button>
        <h2>{monthNames[month]}</h2>
        <button className="navBtn" onClick={() => changeMonth(1)}>›</button>
        <button className="navBtn" onClick={() => changeYear(-1)}>«</button>
        <h2>{year}</h2>
        <button className="navBtn" onClick={() => changeYear(1)}>»</button>
      </div>

      <div className="calendarWeekdays">
        {weekdays.map((day) => (
          <div key={day} className="calendarWeekday">{day}</div>
        ))}
      </div>

      <div className="calendarGrid">
        {days.map((day, i) => (
          <div
            key={i}
            className={`calendarDay ${
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear() ? "today" : ""
            } ${
              (selectedDay === day && selectedDay !== null) ? "selectedDay" : ""
            }`}
            onClick={() => onSelectDay(day)}
          >
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
