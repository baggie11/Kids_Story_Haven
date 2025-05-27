"use client";
import { useState, useEffect, useRef } from "react";
import FloatingCircles from "@/components/FloatingCircles";
import StoryFilters from "@/components/StoryFilters";
import RandomStory from "@/components/RandomStory";
import StoriesGrid from "@/components/StoriesGrid";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) throw new Error("Failed to fetch stories");
        const data = await response.json();
        setStories(data);
        setFilteredStories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleFilterChange = (ageGroup) => {
    if (ageGroup === "All") {
      setFilteredStories(stories);
    } else {
      const filtered = stories.filter((story) => story.age_group === ageGroup);
      setFilteredStories(filtered);
    }
    setSelectedStory(null);
    setVisibleCount(6);
    scrollToTop();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const results = stories.filter(
      (story) =>
        story.title.toLowerCase().includes(query.toLowerCase()) ||
        (story.story && story.story.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredStories(results);
    setSelectedStory(null);
    setVisibleCount(6);
    scrollToTop();
  };

const handleStoryClick = async (story) => {
  const router = useRouter();

  try {
    const response = await fetch('/api/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyId: story.id,
        title: story.title,
        content: story.content, // Make sure this exists
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send story');
    }

    const { rawOutput } = await response.json();

    // Extract parts from rawOutput (very basic parsing)
    const difficultWordsMatch = rawOutput.match(/\[.*?"word":.*?}\]/s);
    const acronymsMatch = rawOutput.match(/\[.*?"acronym":.*?}\]/s);
    const htmlMatch = rawOutput.match(/<html[\s\S]*<\/html>/i);

    const difficultWords = difficultWordsMatch
      ? JSON.parse(difficultWordsMatch[0])
      : [];

    const acronyms = acronymsMatch
      ? JSON.parse(acronymsMatch[0])
      : [];

    const formattedHtml = htmlMatch
      ? htmlMatch[0]
      : "<p>Could not extract HTML preview</p>";

    // Navigate to dynamic route and pass the parsed data (via query or state)
    router.push(`/story/${story.id}?title=${encodeURIComponent(story.title)}`, {
      scroll: true,
    });

    // Alternatively: Use state/context to pass data or store in localStorage
    localStorage.setItem(
      `story-${story.id}-data`,
      JSON.stringify({ formattedHtml, difficultWords, acronyms })
    );

  } catch (error) {
    console.error('Error sending story:', error);
  }
};

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

 

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 gap-6">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, repeatType: "reverse" },
            opacity: { duration: 2, repeat: Infinity }
          }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full h-20 w-20 border-l-4 border-r-4 border-indigo-500 animate-spin animation-delay-100"></div>
          <div className="absolute inset-4 rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 animate-spin animation-delay-200"></div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <motion.p 
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-purple-600 font-medium text-lg"
          >
            Loading magical stories...
          </motion.p>
          <motion.p
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="text-purple-400 text-sm mt-1"
          >
            Preparing an adventure for you
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-screen gap-6 px-4 text-center bg-gradient-to-br from-purple-50 to-indigo-50"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-red-100 to-pink-100 p-6 rounded-2xl shadow-lg border border-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500">
            Oops! Something went wrong
          </h2>
          <p className="text-red-500 max-w-md">
            {error}
          </p>
        </motion.div>
        <motion.button 
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 5px 15px rgba(220, 38, 38, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="mt-4 px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-red-200 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 z-10 overflow-x-hidden" ref={containerRef}>
      <FloatingCircles />
      {/* Back Button */}
      <motion.button
        onClick={() => router.back()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-6 left-6 z-30 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-white/30 hover:shadow-md transition-all flex items-center justify-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link href = "/">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="sr-only">Go back</span>
        </Link>
        
      </motion.button>
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="container mx-auto px-4 py-12 relative z-10"
      >
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl blur opacity-20"></div>
              <div className="relative bg-white px-8 py-6 rounded-lg shadow-lg border border-white/20 backdrop-blur-sm">
                <motion.h1
                  className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  Story Library
                </motion.h1>
              </div>
            </div>
          </motion.div>
          
          <motion.p
            className="text-gray-600 text-xl max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            Discover {stories.length}+ magical stories to spark young imaginations
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ y: -3 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg shadow-sm border border-white/30 backdrop-blur-sm flex items-center gap-2"
            >
              <span className="bg-purple-500 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </span>
              <span className="font-medium text-purple-800">{stories.length}+ Stories</span>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -3 }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg shadow-sm border border-white/30 backdrop-blur-sm flex items-center gap-2"
            >
              <span className="bg-indigo-500 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="font-medium text-indigo-800">Age-appropriate</span>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -3 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg shadow-sm border border-white/30 backdrop-blur-sm flex items-center gap-2"
            >
              <span className="bg-blue-500 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="font-medium text-blue-800">Life lessons</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Sticky Filter Bar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="sticky top-0 z-20 py-4 mb-8 bg-gradient-to-r from-purple-50/95 to-indigo-50/95 backdrop-blur-lg border-b border-white/20 shadow-sm"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <StoryFilters 
                onFilterChange={handleFilterChange} 
                onSearch={handleSearch} 
                searchQuery={searchQuery}
              />
              <RandomStory stories={filteredStories} onSelect={handleStoryClick} />
            </div>
          </div>
        </motion.div>

        {/* Results Info */}
        {filteredStories.length > 0 && (
          <motion.div 
            className="mb-8 flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              whileHover={{ x: 5 }}
              className="text-purple-700 font-medium bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 shadow-sm"
            >
              <span>
                Showing {Math.min(visibleCount, filteredStories.length)} of {filteredStories.length} stories
                {searchQuery && ` for "${searchQuery}"`}
              </span>
            </motion.div>
            {selectedStory && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStory(null)}
                className="text-sm bg-white/80 hover:bg-white text-purple-600 hover:text-purple-800 transition-all px-4 py-2 rounded-lg border border-white/30 shadow-sm flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close story
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Grid */}
        {filteredStories.length > 0 ? (
          <div className="space-y-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1, 
                  transition: { 
                    staggerChildren: 0.1,
                    delayChildren: 0.4
                  } 
                },
              }}
            >
              <StoriesGrid
                stories={filteredStories.slice(0, visibleCount)}

                selectedStoryId={selectedStory?.id}
              />
            </motion.div>

            

            {visibleCount < filteredStories.length && (
              <div className="flex justify-center mt-12">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)"
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLoadMore}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-xl shadow-xl transition-all flex items-center gap-3 hover:shadow-purple-200 group"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ 
                      rotate: { 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "linear" 
                      } 
                    }}
                    className="group-hover:scale-110 transition-transform"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </motion.span>
                  <span className="font-medium text-lg">Load More Stories</span>
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 0.8 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50 inline-block mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <motion.h3 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-700 mb-3"
            >
              No stories found
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 max-w-md mx-auto text-lg"
            >
              {searchQuery 
                ? `We couldn't find any stories matching "${searchQuery}". Try a different search term.`
                : "Try adjusting your filters to find what you're looking for."}
            </motion.p>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchQuery("");
                  handleSearch("");
                }}
                className="mt-6 px-6 py-2.5 text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Clear search
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default StoriesPage;