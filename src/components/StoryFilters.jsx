const StoryFilters = ({ onFilterChange, onSearch }) => {
  const ageGroups = ["All", "4-6","7-12","13+"];
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <select 
        onChange={(e) => onFilterChange(e.target.value)}
        className="text-black backdrop-blur-md bg-white/30 border border-white/20 rounded-lg px-4 py-2 border border-purple-200 focus:ring-2 focus:ring-purple-500"
      >
        {ageGroups.map(group => (
          <option key={group} value={group}>{group}</option>
        ))}
      </select>
      
    
    </div>
  );
};

export default StoryFilters;