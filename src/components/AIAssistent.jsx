"use client"
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoryChatbot({ storyTitle, difficultWords }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Create and display user message
    const newUserMessage = {
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newUserMessage]);
    setInputMessage('');

    try {
      // Send only the user's message to your backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage  // Only sending the user's message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      console.log(data.rawOutput)
      
      // Display Gemini's response
      const newAssistantMessage = {
        text: data.rawOutput,  // Assuming your backend returns { response: "..." }
        sender: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newAssistantMessage]);

    } catch (error) {
      console.error('Error:', error);
      // Show error message to user
      const errorMessage = {
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleWordClick = (wordObj) => {
    const message = `What does "${wordObj.word}" mean?`;
    const definitionMessage = `"${wordObj.word}" means: ${wordObj.definition}\nExample: ${wordObj.example}`;
    
    setMessages(prev => [
      ...prev,
      {
        text: message,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        text: definitionMessage,
        sender: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    
    if (!isChatOpen) setIsChatOpen(true);
  };

  return (
    <>
      {/* Enhanced Floating Help Button */}
      {!isChatOpen && (
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center z-40 hover:shadow-2xl transition-all"
          style={{
            boxShadow: "0 4px 20px -2px rgba(99, 102, 241, 0.5)"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.button>
      )}

      {/* Enhanced Chatbot */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-8 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-blue-100 overflow-hidden z-50"
            style={{
              boxShadow: "0 15px 40px -10px rgba(79, 70, 229, 0.25)",
              background: "linear-gradient(to bottom right, #ffffff, #f8fafc)"
            }}
          >
            {/* Chat Header with Enhanced Design */}
            <div className="relative p-4 text-white flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://img.icons8.com/ios/50/000000/fairy-tale.png')] bg-repeat bg-[length:40px_40px]"></div>
              <div className="flex items-center z-10">
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-md"
                >
                  <span className="text-2xl">📖</span>
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">Story Guide</h3>
                  <p className="text-xs opacity-90">Your reading companion</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition z-10"
              >
                ×
              </button>
            </div>

            {/* Messages Container with Improved Design */}
            <div 
              className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-blue-50/20 to-purple-50/20"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-blue-800/80 p-6">
                  <motion.div
                    animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    📚
                  </motion.div>
                  <h4 className="text-xl font-medium mb-2 text-blue-900">Hello, reader!</h4>
                  <p className="max-w-xs">Ask me about <span className="font-medium text-blue-600">"{storyTitle}"</span> or words to learn their meanings!</p>
                  <div className="mt-4 text-sm text-blue-600/80 flex items-center">
                    <span className="mr-2">💡</span> Try asking about characters or plot!
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs rounded-2xl p-3 relative ${
                          msg.sender === 'user' 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none shadow-md'
                            : 'bg-white text-blue-900 rounded-bl-none shadow-md border border-blue-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'user' ? 'text-blue-200' : 'text-blue-500/70'
                        }`}>
                          {msg.time}
                        </p>
                        {msg.sender === 'assistant' && (
                          <div className="absolute -left-1 -bottom-1 text-2xl opacity-30">📖</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Enhanced Input Area */}
            <form onSubmit={handleSendMessage} className="border-t border-blue-100 p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <div className="flex items-center relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about the story..."
                  className="flex-1 border border-blue-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent pr-12 bg-white/90 backdrop-blur-sm text-blue-900 placeholder-blue-400/70"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-2 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}