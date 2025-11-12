
import { useState } from "react";
import "./Calendar.css";

type CalendarProps = {
  
  onDateSelect: (dateStr: string) => void;
  todosByDate: Record<string, any[]>;
};

const Calendar = ({  onDateSelect, todosByDate }: CalendarProps) => {
  const today = new Date();
  console.log("Calendar received todosByDate keys:", Object.keys(todosByDate));

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

  const onSelectDay = (day: number | null) => {
    if (day === null) return;
    setSelectedDay(day);
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onDateSelect(dateStr);
  };

  const changeMonth = (offset: number) => {
    setMonth((prev) => {
      let newMonth = prev + offset;
      if (newMonth < 0) { setYear((y) => y - 1); newMonth = 11; }
      else if (newMonth > 11) { setYear((y) => y + 1); newMonth = 0; }
      return newMonth;
    });
  };

  const changeYear = (offset: number) => setYear((prev) => prev + offset);

  return (
    <div className="calendarWrapper" >
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
        {days.map((day, i) => {
          if (day === null) return <div key={i} className="calendarDay empty"></div>;

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasTodos = todosByDate[dateStr]?.length > 0;

          return (
            <div
              key={i}
              className={`calendarDay
                ${day === today.getDate() && month === today.getMonth() && year === today.getFullYear() ? "today" : ""}
                
                ${hasTodos ? "hasTodos" : ""}
                ${selectedDay === day ? "selectedDay" : ""}
              `}
              onClick={() => onSelectDay(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
