import React, { useState } from 'react';
import './App.css';
import { motion } from 'framer-motion';
import { FaMicrophone, FaPaperPlane, FaRobot, FaCog, FaGamepad } from 'react-icons/fa';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // تابع ارسال درخواست به API
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-26ebbe7e345e45e3befd117e5ff54996`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
          temperature: 0.7
        })
      });
      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.choices[0].message.content };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ خطا در ارتباط با سرور' }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="App">
      {/* هدر با انیمیشن */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="header"
      >
        <h1><FaRobot className="icon" /> HANZO-AI <span className="version">v0.2</span></h1>
        <div className="header-actions">
          <FaGamepad className="icon" title="حالت گیمینگ" />
          <FaCog className="icon" title="تنظیمات" />
        </div>
      </motion.header>

      {/* بدنه اصلی با گوی انیمیشنی */}
      <main className="main-container">
        <motion.div 
          className="graphic-sphere"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 360],
            boxShadow: ["0px 0px 20px #00f", "0px 0px 40px #f0f", "0px 0px 20px #00f"]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            rotate: { duration: 20, ease: "linear", repeat: Infinity }
          }}
        >
          <div className="sphere-content">
            <FaRobot size={60} color="white" />
            <p>هانزو</p>
          </div>
        </motion.div>

        {/* نمایش پیام‌ها */}
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.role === 'user' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className={`message ${msg.role}`}
            >
              <strong>{msg.role === 'user' ? 'شما' : 'هانزو'}:</strong> {msg.content}
            </motion.div>
          ))}
          {isLoading && <div className="loading">هانزو در حال فکر کردن...</div>}
        </div>

        {/* بخش ورودی */}
        <div className="input-area">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="با هانزو صحبت کن..."
            className="input-field"
          />
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="send-button"
          >
            <FaPaperPlane />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mic-button"
          >
            <FaMicrophone />
          </motion.button>
        </div>
      </main>
    </div>
  );
}

export default App;
