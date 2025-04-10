import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      title: 'UI/UX Design Portfolio',
      description: 'A collection of my best UI/UX design work showcasing user-centered design principles.',
      category: 'design',
      image: '/projects/design-portfolio.jpg',
      tags: ['Figma', 'Adobe XD', 'UI/UX'],
    },
    {
      title: 'Django Web Application',
      description: 'Web development project using Django framework with full authentication and database integration.',
      category: 'development',
      image: '/projects/django-app.jpg',
      tags: ['Django', 'Python', 'PostgreSQL'],
    },
    {
      title: 'Cybersecurity Research',
      description: 'Research work on modern cybersecurity threats and prevention methods.',
      category: 'security',
      image: '/projects/security.jpg',
      tags: ['Cybersecurity', 'Research', 'Analysis'],
    },
    {
      title: 'WordPress Portfolio Theme',
      description: 'Custom WordPress theme development with modern design principles.',
      category: 'development',
      image: '/projects/wordpress.jpg',
      tags: ['WordPress', 'PHP', 'CSS'],
    },
  ];

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Design', value: 'design' },
    { label: 'Development', value: 'development' },
    { label: 'Security', value: 'security' },
  ];

  const filteredProjects = projects.filter(
    (project) => activeFilter === 'all' || project.category === activeFilter
  );

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8">Projects</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Coming soon...
        </p>
      </div>
    </section>
  );
} 