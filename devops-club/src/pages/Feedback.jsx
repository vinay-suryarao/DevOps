const Feedback = () => {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">Feedback Form 💬</h1>
      <p className="mb-6 text-gray-600">Help us improve! Your feedback is valuable.</p>

      {/* Feedback form to be connected to Google Sheets */}
      <form className="space-y-4">
        <input type="text" placeholder="Your Name" className="w-full p-2 border rounded" />
        <input type="email" placeholder="Your Email" className="w-full p-2 border rounded" />
        <textarea placeholder="Your Feedback" className="w-full p-2 border rounded h-32" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default Feedback;
