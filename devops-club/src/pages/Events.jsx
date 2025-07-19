const Events = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Our Events</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Example Event Card */}
        <div className="border p-4 rounded-lg shadow hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold text-gray-800">Docker Deep Dive</h2>
          <p className="text-gray-600">A hands-on session exploring Docker concepts and real-world usage.</p>
          <p className="text-sm text-gray-500 mt-2">Date: Aug 5, 2025</p>
        </div>

        <div className="border p-4 rounded-lg shadow hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold text-gray-800">CI/CD Pipeline Workshop</h2>
          <p className="text-gray-600">Learn how to build and deploy using Jenkins, GitHub Actions, and more.</p>
          <p className="text-sm text-gray-500 mt-2">Date: Aug 12, 2025</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Register for Upcoming Events</h2>
        {/* Registration form will go here later */}
        <p className="text-gray-500">Form will be integrated soon using Google Sheets.</p>
      </div>
    </div>
  );
};

export default Events;
