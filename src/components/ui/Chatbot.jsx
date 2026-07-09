import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hi! I am your TuitionHub AI assistant. How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/ai/chat', { prompt: userMsg.text });
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Sorry, I am having trouble connecting to my brain right now. Make sure you restarted the frontend server.';
      setMessages(prev => [...prev, { sender: 'ai', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 z-50 group flex items-center justify-center ${isOpen ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'}`}
      >
        <MessageSquare className="w-6 h-6 group-hover:animate-pulse" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[320px] md:w-[350px] h-[480px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-slate-200/60 dark:border-slate-700/50 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 p-4 flex justify-between items-center shadow-md relative overflow-hidden shrink-0">
            <div className="absolute -right-4 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-4 -bottom-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="flex items-center relative z-10">
              <div className="relative mr-3">
                 <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/20 shadow-inner">
                   <Bot className="w-6 h-6 text-white" />
                 </div>
                 <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-indigo-600 rounded-full shadow-sm"></span>
              </div>
              <div>
                <h3 className="font-medium text-white text-[16px] leading-tight tracking-wide">AI Assistant</h3>
                <p className="text-[11px] text-indigo-100 font-medium tracking-wider uppercase flex items-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/20 p-2 rounded-full transition-colors relative z-10 text-white/90 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50 dark:bg-slate-900/30 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                
                {msg.sender === 'ai' && (
                  <div className="flex-shrink-0 mr-3 mt-1 hidden md:block">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-sm">
                      <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-[75%] p-3.5 rounded-2xl text-[14.5px] leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-blue-500/20' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 rounded-tl-sm shadow-slate-200/50 dark:shadow-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="flex-shrink-0 mr-3 mt-1 hidden md:block">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-sm">
                      <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-2">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                   <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-700/50 flex gap-3 shrink-0">
            <input 
              type="text" 
              className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all text-[14.5px] font-medium border border-transparent focus:bg-white dark:focus:bg-slate-900 shadow-inner"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
