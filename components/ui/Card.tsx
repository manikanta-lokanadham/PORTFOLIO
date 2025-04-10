import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  period?: string;
  description?: ReactNode;
  skills?: string[];
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export default function Card({
  icon,
  title,
  subtitle,
  period,
  description,
  skills,
  className = '',
  gradientFrom = 'from-primary/10',
  gradientTo = 'to-secondary/10'
}: CardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`card group h-full ${className}`}
    >
      <div className={`card-glow bg-gradient-to-r ${gradientFrom} ${gradientTo}`} />
      <div className="card-content h-full flex flex-col">
        <div className="flex flex-col md:flex-row gap-6 flex-grow">
          {icon && (
            <div className="flex-shrink-0">
              <div className={`card-icon ${gradientFrom}`}>
                {icon}
              </div>
            </div>
          )}
          <div className="flex-grow flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h3 className="card-title">
                  {title}
                </h3>
                {subtitle && (
                  <p className="card-subtitle">{subtitle}</p>
                )}
              </div>
              {period && (
                <div className="flex items-center">
                  <span className="card-period">
                    {period}
                  </span>
                </div>
              )}
            </div>
            {description && (
              <div className="card-description flex-grow">
                {description}
              </div>
            )}
            {skills && skills.length > 0 && (
              <div className="card-skills mt-auto">
                {skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 