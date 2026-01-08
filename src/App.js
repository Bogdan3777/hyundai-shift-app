import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { motion } from 'framer-motion';
import 'react-calendar/dist/Calendar.css';

const baseDate = new Date('2026-01-05'); // понеділок
const chiefs = ["Tono", "Boris", "Stano"];
const shifts = [
  { name: "Ранкова", time: "06:00 – 14:00", color: "#4CAF50" },
  { name: "Нічна", time: "22:00 – 06:00", color: "#FF5722" },
  { name: "Денна", time: "14:00 – 22:00", color: "#2196F3" }
];

const translations = {
  uk: {
    title: "Графік змін Hyundai Transys",
    greeting1: "Привіт, ",
    greeting2: "! 🔥",
    greeting3: "Бригада ",
    greeting4: " — це сила! 💪",
    greeting5: "Готовий подивитися, яка зміна чекає на тебе цього разу?",
    greeting6: "Тримай календар — працюймо разом! ⚙️",
    currentShift: "Поточна бригада:",
    rest: "Відпочинь добре 😊",
    reminders: "Нагадування про зміну",
    language: "Мова:",
    ukrainian: "Українська",
    slovak: "Slovenský"
  },
  sk: {
    title: "Grafik zmien Hyundai Transys",
    greeting1: "Ahoj, ",
    greeting2: "! 🔥",
    greeting3: "Brigáda ",
    greeting4: " — to je sila! 💪",
    greeting5: "Pripravený pozrieť sa, aká zmena ťa čaká tentokrát?",
    greeting6: "Tu máš kalendár — pracujme spolu! ⚙️",
    currentShift: "Aktuálna brigáda:",
    rest: "Dobre si oddychuj 😊",
    reminders: "Pripomienky zmeny",
    language: "Jazyk:",
    ukrainian: "Українська",
    slovak: "Slovenčina"
  }
};

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // неділя (0) і субота (6) — вихідні
}

function getShift(date, chiefIndex, lang = 'uk') {
  if (isWeekend(date)) {
    const restText = lang === 'uk' ? "Вихідний" : "Voľno";
    return { name: restText, time: "", color: "#757575" };
  }

  // Правильний розрахунок кількості тижнів від baseDate (понеділок)
  const timeDiff = date.getTime() - baseDate.getTime();
  const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const weeksPassed = Math.floor(daysPassed / 7);
  const shiftIndex = (weeksPassed + chiefIndex) % 3;

  const shiftNames = lang === 'uk' 
    ? ["Ранкова", "Нічна", "Денна"] 
    : ["Ranná", "Nočná", "Denná"];

  const shiftTimes = ["06:00 – 14:00", "22:00 – 06:00", "14:00 – 22:00"];
  const colors = ["#4CAF50", "#FF5722", "#2196F3"];

  return {
    name: shiftNames[shiftIndex],
    time: shiftTimes[shiftIndex],
    color: colors[shiftIndex]
  };
}

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedChiefIndex, setSelectedChiefIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState('uk');

  const t = translations[language];

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      Telegram.WebApp.ready();
      Telegram.WebApp.expand();

      const user = Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        const name = user.username || user.first_name || (language === 'uk' ? "друже" : "kamarát");
        setUsername(name);

        const index = chiefs.findIndex(chief => 
          name.toLowerCase().includes(chief.toLowerCase()) ||
          chief.toLowerCase().includes(name.toLowerCase())
        );
        if (index !== -1) {
          setSelectedChiefIndex(index);
        }

        if (user.language_code === 'sk' || name.toLowerCase().includes('stano') || name.toLowerCase().includes('boris')) {
          setLanguage('sk');
        }
      }
    }
  }, [language]);

  const currentChief = chiefs[selectedChiefIndex];
  const shift = getShift(selectedDate, selectedChiefIndex, language);

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto", textAlign: "center" }}>
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ color: "#1E88E5" }}
      >
        {t.title}
      </motion.h1>

      {/* Персоналізоване привітання */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ fontSize: "1.4em", margin: "20px 0", lineHeight: "1.6" }}
      >
        <p style={{ margin: "8px 0" }}>
          {t.greeting1}<strong style={{ color: "#E91E63" }}>{username}</strong>{t.greeting2}
        </p>
        <p style={{ margin: "8px 0" }}>
          {t.greeting3}<strong style={{ color: "#1E88E5" }}>{currentChief}</strong>{t.greeting4}
        </p>
        <p style={{ margin: "8px 0" }}>{t.greeting5}</p>
        <p style={{ margin: "8px 0", fontWeight: "bold" }}>{t.greeting6}</p>
      </motion.div>

      {/* Вибір мови */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ margin: "20px 0" }}
      >
        <label style={{ fontSize: "1.2em" }}>
          {t.language}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "8px",
              fontSize: "1.1em",
              borderRadius: "8px",
              border: "2px solid #1E88E5"
            }}
          >
            <option value="uk">{t.ukrainian}</option>
            <option value="sk">{t.slovak}</option>
          </select>
        </label>
      </motion.div>

      {/* Вибір бригади */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ marginBottom: "30px" }}
      >
        <label style={{ fontSize: "1.2em", display: "block", marginBottom: "10px" }}>
          {t.currentShift}
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

      {/* Календар — тиждень починається з понеділка */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate} 
          locale={language === 'uk' ? "uk-UA" : "sk-SK"}
          // Критично: тиждень починається з понеділка
          firstDayOfWeek={1}
        />
      </motion.div>

      {/* Зміна на вибрану дату */}
      <motion.div
        key={selectedDate.toString() + language}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
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
          {shift.time || t.rest}
        </p>
        <p style={{ color: "#555", fontSize: "1.1em" }}>
          {selectedDate.toLocaleDateString(language === 'uk' ? 'uk-UA' : 'sk-SK', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </motion.div>

      {/* Перемикач нагадувань */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{ marginTop: "40px" }}
      >
        <label style={{ fontSize: "1.3em", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <input
            type="checkbox"
            defaultChecked={true}
            style={{ transform: "scale(1.8)" }}
          />
          <span>{t.reminders}</span>
        </label>
      </motion.div>
    </div>
  );
}

export default App;
