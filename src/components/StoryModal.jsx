const StoryModal = ({ story, onClose }) => {
  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white/30 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative text-white">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-purple-300 text-xl"
        >
          ✕
        </button>

        {/* Story Title */}
        <h2 className="text-3xl font-semibold text-purple-200 mb-2">{story.title}</h2>
        <p className="text-purple-100 mb-4 italic">Recommended Age: {story.age_group}</p>

        {/* Story Body */}
        <div className="whitespace-pre-line text-white mb-6 leading-relaxed tracking-wide">
          {story.story}
        </div>

        {/* Safety Warning */}
        {story.safety_violations.present && (
          <div className="bg-yellow-100/20 border border-yellow-300/30 rounded-xl p-4 mb-6">
            <p className="text-yellow-200 text-sm">
              ⚠️ <span className="font-semibold">Note:</span> {story.safety_violations.description}
            </p>
          </div>
        )}

        {/* Chat Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-6 border border-white/20">
          <h3 className="text-purple-100 text-lg font-semibold mb-2">Chat about this story</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask something..."
              className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
