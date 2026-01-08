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
  return day === 0 || day === 6; // неділя і субота — вихідні
}

// ВИПРАВЛЕНИЙ РОЗРАХУНОК — точно по днях, без помилки часу
function getShift(date, chiefIndex, lang = 'uk') {
  if (isWeekend(date)) {
    const restText = lang === 'uk' ? "Вихідний" : "Voľno";
    return { name: restText, time: "", color: "#757575" };
  }

  // Точний розрахунок повних днів
  const utc1 = Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const utc2 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const daysPassed = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
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
      {/* ... (весь інший код без змін — привітання, вибір мови, бригади, календар з firstDayOfWeek={1}, блок зміни) */}
      
      {/* Календар — тиждень з понеділка */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate} 
          locale={language === 'uk' ? "uk-UA" : "sk-SK"}
          firstDayOfWeek={1}  // понеділок перший день тижня
        />
      </motion.div>

      {/* ... (блок зміни без змін) */}
    </div>
  );
}

export default App;
