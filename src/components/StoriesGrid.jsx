import StoryCard from "./StoryCard";
const StoriesGrid = ({ stories, onStoryClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map(story => (
        <StoryCard 
          key={story.id} 
          story={story} 
          onClick={onStoryClick} 
        />
      ))}
    </div>
  );
};

export default StoriesGrid;