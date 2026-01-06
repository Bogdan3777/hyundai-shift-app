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

function getShift(date, chiefIndex) {
  if (isWeekend(date)) return { name: "Вихідний", time: "", color: "#757575" };

  const daysPassed = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
  const shiftIndex = (Math.floor(daysPassed / 7) + chiefIndex) % 3;
  return shifts[shiftIndex];
}

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedChiefIndex, setSelectedChiefIndex] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      Telegram.WebApp.ready();
      Telegram.WebApp.expand();

      const user = Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        const name = user.username || user.first_name || "Користувач";
        setUsername(name);

        // Автоматично вибираємо зміну, якщо ім'я збігається з одним з chiefs
        const index = chiefs.findIndex(chief => 
          name.toLowerCase().includes(chief.toLowerCase()) ||
          chief.toLowerCase().includes(name.toLowerCase())
        );
        if (index !== -1) {
          setSelectedChiefIndex(index);
        }
      }
    }
  }, []);

  const currentChief = chiefs[selectedChiefIndex];
  const shift = getShift(selectedDate, selectedChiefIndex);

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
        style={{ fontSize: "1.4em", margin: "20px 0" }}
      >
        Привіт! Ти з зміни <strong style={{ color: "#E91E63" }}>{currentChief}</strong>
      </motion.p>

      {/* Вибір зміни */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ marginBottom: "30px" }}
      >
        <label style={{ fontSize: "1.2em", display: "block", marginBottom: "10px" }}>
          Поточна зміна:
        </label>
        <select
          value={selectedChiefIndex}
          onChange={(e) => setSelectedChiefIndex(Number(e.target.value))}
          style={{
            padding: "12px",
            fontSize: "1.2em",
            borderRadius: "12px",
            border: "2px solid #1E88E5",
            background: "white",
            width: "100%",
            maxWidth: "300px"
          }}
        >
          {chiefs.map((chief, index) => (
            <option key={index} value={index}>{chief}</option>
          ))}
        </select>
      </motion.div>

      {/* Календар */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Calendar onChange={setSelectedDate} value={selectedDate} locale="uk-UA" />
      </motion.div>

      {/* Відображення зміни на вибрану дату */}
      <motion.div
        key={selectedDate.toString()} // для анімації при зміні дати
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: "30px",
          padding: "25px",
          background: shift.color + "22",
          borderRadius: "20px",
          border: `4px solid ${shift.color}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ color: shift.color, margin: "0", fontSize: "2em" }}>
          {shift.name}
        </h2>
        <p style={{ fontSize: "1.8em", margin: "15px 0" }}>
          {shift.time || "Відпочинь добре 😊"}
        </p>
        <p style={{ color: "#555", fontSize: "1.1em" }}>
          {selectedDate.toLocaleDateString('uk-UA', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </motion.div>

      {/* Перемикач нагадувань (візуальний, логіку можна додати пізніше) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ marginTop: "40px" }}
      >
        <label style={{ fontSize: "1.3em", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <input
            type="checkbox"
            defaultChecked={true}
            style={{ transform: "scale(1.8)" }}
          />
          <span>Нагадування про зміну</span>
        </label>
      </motion.div>
    </div>
  );
}

export default App;
