const Newsletters = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Club Newsletters 📰</h1>

      <ul className="space-y-4">
        <li>
          <a href="/pdfs/newsletter-june.pdf" className="text-blue-600 hover:underline">
            📄 June 2025 Edition
          </a>
        </li>
        <li>
          <a href="/pdfs/newsletter-july.pdf" className="text-blue-600 hover:underline">
            📄 July 2025 Edition
          </a>
        </li>
        {/* Add more newsletter links here */}
      </ul>
    </div>
  );
};

export default Newsletters;
