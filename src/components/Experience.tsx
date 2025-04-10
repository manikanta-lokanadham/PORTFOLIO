import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const experiences = [
    {
      title: 'UI/UX & Graphic Designer Trainee',
      company: 'Techwing',
      period: 'June 2024 - Present',
      location: 'Rajahmundry, Andhra Pradesh, India',
    },
    {
      title: 'UI/UX Designer',
      company: 'SPARK+ Technologies',
      period: 'May 2024 - August 2024',
      location: 'Goa, India',
    },
    {
      title: 'Artificial Intelligence And Cyber Security Intern',
      company: 'AIMER Society',
      period: 'May 2024 - July 2024',
      location: 'Vijayawada, Andhra Pradesh, India',
    },
    {
      title: 'UI/UX Designing Intern',
      company: 'Coding Samurai',
      period: 'March 2024 - April 2024',
      location: 'Remote',
    },
    {
      title: 'Web Development Using Django Framework Intern',
      company: 'Andhra Pradesh State Skill Development Corporation (APSSDC)',
      period: 'May 2023 - July 2023',
      location: 'Andhra Pradesh, India',
    },
  ];

  return (
    <section id="experience" className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Experience</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-purple-200 dark:bg-purple-900 transform -translate-x-1/2"></div>

            {/* Experience items */}
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative flex md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                } items-center mb-8`}
              >
                <div className="flex-1 md:w-1/2 p-6">
                  <div className={`bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-lg ${
                    index % 2 === 0 ? 'md:ml-6' : 'md:mr-6'
                  }`}>
                    <h3 className="text-xl font-semibold text-purple-600">{exp.title}</h3>
                    <p className="text-lg font-medium mt-2">{exp.company}</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{exp.period}</p>
                    <p className="text-gray-500 dark:text-gray-500 mt-1">{exp.location}</p>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-purple-600 rounded-full transform -translate-x-1/2"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 