import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const skills = [
    'Adobe Illustrator',
    'Adobe Photoshop',
    'Figma',
    'HTML5-CSS3',
    'React',
    'Next.js',
    'UI/UX Design',
    'WordPress',
    'AWS',
    'MySQL',
    'Linux Shell',
    'Cybersecurity'
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Experienced User Interface Designer with a demonstrated history of working in information technology. 
                I specialize in creating engaging digital experiences and have a strong foundation in both design and development.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Currently pursuing my Bachelor of Technology in Computer Science & Engineering 
                from Godavari Institute of Engineering and Technology, I combine my technical knowledge 
                with creative design skills to deliver exceptional user experiences.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Skills</h3>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <motion.a
              href="/resume.pdf"
              download
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Resume
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 