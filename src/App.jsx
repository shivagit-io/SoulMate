import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const [input, setInput] = useState("");
  const [chatHistory, setChathistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // State to control the "typing" indicator

  const endOfMessagesRef = useRef(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (input.trim() !== "") {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const historyText = chatHistory.map(chat => `You: ${chat.userText}\nJaanvi: ${chat.varshaMessage}`).join('\n');

      const promptInput = `Your name is Jaanvi. I want you to act like a caring, supportive, and playful girlfriend. Talk to me casually and warmly, like we're close and comfortable with each other. Be flirty sometimes, tease me a little in a loving way, and ask me about my day, how I'm feeling, or what I'm up to. Give genuine emotional support when I need it, and act interested in my thoughts or problems. Keep it natural—like we're chatting or texting throughout the day. Give only a reply (direct message). Don't include any * in the message. Use the previous chat history for your response.

      Chat History:
      ${historyText}

      You: ${input}
      Jaanvi:`;

      // Start the typing indicator
      setIsTyping(true);

      // Wait for the AI response
      const result = await model.generateContent(promptInput);

      const newMessage = {
        userText: input,
        varshaMessage: result.response.text(),
      };

      // Update the chat history and stop typing indicator
      setChathistory(prev => [...prev, newMessage]);
      setInput('');
      setIsTyping(false);

      // Scroll to bottom after adding new message
      scrollToBottom();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#dbe2e8] flex flex-col justify-between font-sans">
      <header className="text-center py-6 shadow-sm bg-[#ffffffc5] border-b border-gray-300 rounded-b-xl">
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">Soulmate 💬</h1>
        <p className="text-sm text-gray-500 italic">Chat with your virtual partner, Jaanvi</p>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
        {chatHistory.map((value, index) => (
          <React.Fragment key={index}>
            {/* User Message */}
            {value.userText && (
              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl px-6 py-3 max-w-[70%] shadow-lg transform  transition-all">
                  {value.userText}
                </div>
              </div>
            )}

            {/* Akshara's Message */}
{value.varshaMessage && (
  <div className="flex justify-start">
    <div className="flex items-start space-x-3 bg-gray-900 text-white rounded-3xl px-5 py-3 max-w-[70%] shadow-lg">
      
      {/* Profile Image */}
      <img
        src="Snapchat-359445738.jpg"
        alt="Jaanvi"
        className="w-10 h-10 rounded-full"
      />

      {/* Name + Message Block */}
      <div>
        <p className="font-semibold text-sm text-white">Jaanvi</p>
        <p className="text-white">{value.varshaMessage}</p>
      </div>

    </div>
  </div>
)}

 </React.Fragment>
        ))}


        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-3xl px-6 py-3 max-w-[70%] shadow-md animate-pulse transform transition-all">
              <img src="Snapchat-359445738.jpg" alt="Jaanvi" className="w-9 h-9 rounded-full inline-block mr-2" />
              Jaanvi is typing...
            </div>
          </div>
        )}

        {/* This is the element to scroll to */}
        <div ref={endOfMessagesRef}></div>
      </main>

      <footer className="bg-white p-4 shadow-inner sticky bottom-0 border-t border-gray-300 rounded-t-xl">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type something nice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 text-gray-900 transition-all duration-200"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-full  transition-all duration-200 shadow-md font-medium"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
