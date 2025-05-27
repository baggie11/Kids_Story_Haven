"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const StoryCard = ({ story }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStoryClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId: story.id,
          title: story.title,
          content: story.story,
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
        `story-${story.id}-data`,
        JSON.stringify({ formattedHtml, difficultWords, acronyms })
      );

      // Navigate to the story page
      router.push(`/story/${story.id}?title=${encodeURIComponent(story.title)}`);

    } catch (error) {
      console.error('Error sending story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={handleStoryClick}
      className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border border-purple-100"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-blue-600 text-sm font-medium">Preparing your story...</p>
          </div>
        </div>
      )}
      
      <h3 className="text-purple-600 font-bold text-lg">{story.title}</h3>
      <p className="text-gray-600 text-sm mt-2">Age: {story.age_group}</p>
      <p className="text-gray-500 mt-2 line-clamp-2">
        {story.story.substring(0, 100)}...
      </p>
      {story.safety_violations?.present && (
        <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
          ⚠️ Mild Conflict
        </span>
      )}
    </div>
  );
};

export default StoryCard;