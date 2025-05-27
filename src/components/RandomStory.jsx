"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RandomStory = ({ stories }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const pickRandomStory = async () => {
    if (!stories || stories.length === 0) return;
    
    setIsLoading(true);
    const randomIndex = Math.floor(Math.random() * stories.length);
    const randomStory = stories[randomIndex];

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId: randomStory.id,
          title: randomStory.title,
          content: randomStory.story,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send story');
      }

      const data = await response.json();
      const { rawOutput } = data;

      const difficultWordsMatch = rawOutput.match(/\[.*?"word":.*?}\]/s);
      const acronymsMatch = rawOutput.match(/\[.*?"acronym":.*?}\]/s);
      const htmlMatch = rawOutput.match(/<html[\s\S]*<\/html>/i);

      const difficultWords = difficultWordsMatch ? JSON.parse(difficultWordsMatch[0]) : [];
      const acronyms = acronymsMatch ? JSON.parse(acronymsMatch[0]) : [];
      const formattedHtml = htmlMatch ? htmlMatch[0] : "<p>Could not extract HTML preview</p>";

      // Save parsed data to localStorage
      localStorage.setItem(
        `story-${randomStory.id}-data`,
        JSON.stringify({ formattedHtml, difficultWords, acronyms })
      );

      // Navigate to the story page
      router.push(`/story/${randomStory.id}?title=${encodeURIComponent(randomStory.title)}`);

    } catch (error) {
      console.error('Error processing random story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={pickRandomStory}
        disabled={isLoading}
        className={`bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition ${
          isLoading ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Preparing your story...
          </span>
        ) : (
          '🎲 Pick a Random Story'
        )}
      </button>
      
      {isLoading && (
        <div className="absolute -bottom-8 left-0 right-0 text-center text-sm text-purple-600">
          Finding a great story for you...
        </div>
      )}
    </div>
  );
};

export default RandomStory;