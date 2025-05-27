"use client"
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import VoicePronouncer from './VoiceComponent';
import StoryChatbot from './AIAssistent';

export default function StoryPage({ storyId, title }) {
  const router = useRouter();
  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState('story');
  const [formattedHtml, setFormattedHtml] = useState('');
  const [difficultWords, setDifficultWords] = useState([]);
  const [acronyms, setAcronyms] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadStoryData = async () => {
      try {
        if (!storyId) {
          throw new Error('No story ID provided');
        }

        const localStorageKey = `story-${storyId}-data`;
        const cachedData = localStorage.getItem(localStorageKey);
        
        if (cachedData) {
          const { formattedHtml, difficultWords, acronyms } = JSON.parse(cachedData);
          setFormattedHtml(formattedHtml);
          setDifficultWords(difficultWords);
          setAcronyms(acronyms);
          setStory({
            id: storyId,
            title: decodeURIComponent(title || 'Untitled Story'),
            content: formattedHtml
          });
        } else {
          setStory({
            id: storyId,
            title: decodeURIComponent(title || 'Untitled Story'),
            content: "Story content not found in cache. Please try reloading the story."
          });
        }
      } catch (error) {
        console.error("Error loading story data:", error);
        setStory({
          id: 'error',
          title: 'Error Loading Story',
          content: 'Could not load the story content. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStoryData();
  }, [storyId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto flex items-center justify-center shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </motion.div>
          <motion.p 
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl font-medium text-blue-800"
          >
            Crafting your reading journey...
          </motion.p>
          <p className="text-blue-600/80">Loading {decodeURIComponent(title || 'your story')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Floating Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/stories')}
            className="flex items-center space-x-2 group"
          >
            <div className="w-9 h-9 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="text-sm font-medium text-blue-800 group-hover:text-blue-600 transition-colors hidden sm:inline">Library</span>
          </motion.button>
          
       
          
         
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-16 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Story Card with Floating Effect */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
         
          
          {/* Story Content */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100/50 backdrop-blur-sm">
            {/* Story Header */}
            <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-blue-900">{story?.title}</h2>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">Interactive</span>
                    <span className="text-xs px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full">Reading Mode</span>
                  </div>
                </div>
  
              </div>
            </div>
            
            {/* Story Body */}
            <div className="p-6 md:p-8 bg-gradient-to-b from-white to-blue-50/30">
              <div 
                className="prose prose-lg max-w-none font-serif text-blue-900/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formattedHtml }}
              />
            </div>
            
            {/* Story Footer */}
            <div className="p-6 border-t border-blue-100 bg-gradient-to-r from-blue-50/70 to-purple-50/70">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-sm text-blue-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  You've completed this story
                </div>
                <div className="flex space-x-3">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center"
                  >
                    <span>Back to Top</span>
                  </motion.button>
                 
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <VoicePronouncer />
      {/* Chatbot Component */}
      <StoryChatbot />
    </div>
  );
}