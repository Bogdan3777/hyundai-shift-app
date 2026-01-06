import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { motion } from 'framer-motion';
import 'react-calendar/dist/Calendar.css';

const baseDate = new Date('2026-01-05');
const chiefs = ["Tono", "Boris", "Stano"];
const shifts = [
  { name: "Ранкова", time: "06:00 – 14:00", color: "#4CAF50" },
  { name: "Нічна", time: "22:00 – 06:00", color: "#FF5722" },
  { name: "Денна", time: "14:00 – 22:00", color: "#2196F3" }
];

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // неділя і субота — вихідні
}

function getShift(date, username = "Tono") {
  if (isWeekend(date)) return { name: "Вихідний", time: "", color: "#757575" };

  const daysPassed = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
  const chiefIndex = chiefs.indexOf(username) !== -1 ? chiefs.indexOf(username) : 0;
  const shiftIndex = (Math.floor(daysPassed / 7) + chiefIndex) % 3;
  return shifts[shiftIndex];
}

function App() {
  const [date, setDate] = useState(new Date());
  const [reminders, setReminders] = useState(true);
  const [username, setUsername] = useState("Tono");

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      Telegram.WebApp.ready();
      Telegram.WebApp.expand();
      const user = Telegram.WebApp.initDataUnsafe?.user;
      if (user?.username) setUsername(user.username);
      else if (user?.first_name) setUsername(user.first_name);
    }
  }, []);

  const shift = getShift(date, username);

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto", textAlign: "center" }}>
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ color: "#1E88E5" }}
      >
        Графік змін Hyundai Transys
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Привіт, {username}!
      </motion.p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Calendar onChange={setDate} value={date} locale="uk-UA" />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          marginTop: "30px",
          padding: "25px",
          background: shift.color + "22",
          borderRadius: "20px",
          border: `4px solid ${shift.color}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ color: shift.color, margin: "0", fontSize: "2em" }}>{shift.name}</h2>
        <p style={{ fontSize: "1.8em", margin: "15px 0" }}>{shift.time || "Відпочинь 😊"}</p>
        <p style={{ color: "#555", fontSize: "1.1em" }}>
          {date.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: "40px" }}
      >
        <label style={{ fontSize: "1.3em", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <input
            type="checkbox"
            checked={reminders}
            onChange={(e) => setReminders(e.target.checked)}
            style={{ transform: "scale(1.8)" }}
          />
          <span>Нагадування про зміну</span>
        </label>
      </motion.div>
    </div>
  );
}

export default App;
