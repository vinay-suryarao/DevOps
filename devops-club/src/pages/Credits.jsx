import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

// Import your images from the assets folder
import mentorImg from '../assets/vishal.png';
import vinayImg from '../assets/Technical_Vinay.png';
import deepImg from '../assets/Deep.png';
import rumizaImg from '../assets/Rumiza.png';
import avishaImg from '../assets/Avisha.jpeg';

// Reusable card component with the new design
const ProfileCard = ({ name, role, imageUrl, githubUrl, linkedinUrl }) => {
  return (
    <div className="relative bg-[#34495e] rounded-lg shadow-xl overflow-hidden group">
      {/* Background Banner */}
      <div className="h-24 bg-orange-400"></div>
      
      {/* Profile Image */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <img
          src={imageUrl}
          alt={`Profile of ${name}`}
          className="w-28 h-28 rounded-full border-4 border-[#2c3e50] transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Card Content */}
      <div className="pt-20 pb-6 px-4 text-center">
        <h3 className="text-2xl font-bold text-white">{name}</h3>
        <p className="text-gray-300">{role}</p>
        
        {/* Social Links */}
        <div className="mt-4 flex justify-center gap-5 text-2xl text-white">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-400 transform hover:-translate-y-1 transition-all"
            aria-label={`${name}'s Github Profile`}
          >
            <FaGithub />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-400 transform hover:-translate-y-1 transition-all"
            aria-label={`${name}'s LinkedIn Profile`}
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
};

export default function Credits() {
  const team = [
    {
      name: 'Mr. Vishal Badgujar',
      role: 'Mentor',
      imageUrl: mentorImg,
      githubUrl: 'https://github.com/vishal003',
      linkedinUrl: 'https://www.linkedin.com/in/vishalbadgujar/',
    },
    {
      name: 'Vinay Suryarao',
      role: 'Team Lead',
      imageUrl: vinayImg,
      githubUrl: 'https://github.com/vinay-suryarao',
      linkedinUrl: 'https://www.linkedin.com/in/vinay-suryarao/',
    },
    {
      name: 'Deep Varkute',
      role: 'Core Member',
      imageUrl: deepImg,
      githubUrl: 'https://github.com/Deep-0491',
      linkedinUrl: 'https://www.linkedin.com/in/deep-varkute-b59a49374/',
    },
    {
      name: 'Sayyeda Rumiza',
      role: 'Core Member',
      imageUrl: rumizaImg,
      githubUrl: 'https://github.com/RumizaSayyeda',
      linkedinUrl: 'https://www.linkedin.com/in/sayyeda-rumiza-0b08b727a/',
    },
    {
      name: 'Avisha Varkute',
      role: 'Core Member',
      imageUrl: avishaImg,
      githubUrl: 'https://github.com/avisha78',
      linkedinUrl: 'https://www.linkedin.com/in/avisha-varkute-2b1764335',
    },
  ];

  const mentor = team[0];
  const members = team.slice(1);

  return (
    <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-2 text-orange-400">Meet The Team</h1>
          <p className="text-lg text-gray-300">The brilliant minds behind the APSIT DevOps Club website.</p>
        </div>

        {/* Team Members Section - MOVED TO TOP */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Core Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {members.map((member) => (
              <ProfileCard key={member.name} {...member} />
            ))}
          </div>
        </div>

        {/* Mentor Section - MOVED TO BOTTOM */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Our Mentor</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <ProfileCard {...mentor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
