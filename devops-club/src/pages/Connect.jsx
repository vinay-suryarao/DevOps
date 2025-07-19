const Connect = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">Connect With Us</h1>
      <p className="text-gray-700 mb-6">Have questions, suggestions, or want to collaborate? Reach out!</p>

      <div className="space-y-4">
        <p><a href="https://wa.me/YOUR_NUMBER" className="text-blue-600 hover:underline">WhatsApp</a></p>
        <p><a href="https://instagram.com/YOUR_HANDLE" className="text-blue-600 hover:underline">Instagram</a></p>
        <p><a href="mailto:yourclub@email.com" className="text-blue-600 hover:underline">Email Us</a></p>
      </div>
    </div>
  );
};

export default Connect;
