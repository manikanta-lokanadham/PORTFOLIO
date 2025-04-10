import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Card from '../ui/Card';

const skillCategories = [
  {
    icon: '💻',
    title: 'Frontend Development',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3']
  },
  {
    icon: '⚡',
    title: 'Backend Development',
    skills: ['Node.js', 'Express', 'Python', 'Django', 'PostgreSQL', 'MongoDB']
  },
  {
    icon: '🎨',
    title: 'UI/UX Design',
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Wireframing', 'Prototyping']
  },
  {
    icon: '🚀',
    title: 'DevOps & Tools',
    skills: ['Git', 'Docker', 'AWS', 'CI/CD', 'Linux', 'Nginx']
  },
  {
    icon: '📱',
    title: 'Mobile Development',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin']
  },
  {
    icon: '🔧',
    title: 'Other Skills',
    skills: ['Problem Solving', 'Team Leadership', 'Agile/Scrum', 'Technical Writing', 'API Design', 'Testing']
  }
];

export default function Skills() {
  return (
    <Section
      id="skills"
      title="Skills & Expertise"
      subtitle="A comprehensive overview of my technical skills and professional expertise"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              icon={<span className="text-3xl">{category.icon}</span>}
              title={category.title}
              skills={category.skills}
              className="h-full"
              gradientFrom={index % 2 === 0 ? 'from-primary/10' : 'from-secondary/10'}
              gradientTo={index % 2 === 0 ? 'to-secondary/10' : 'to-primary/10'}
            />
          </motion.div>
        ))}
      </div>
    </Section>
  );
} 