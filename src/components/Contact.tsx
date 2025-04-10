import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  const contactInfo = [
    {
      label: 'Phone',
      value: '8309241420',
      link: 'tel:8309241420',
    },
    {
      label: 'Email',
      value: 'lokanadhammanikanta111@gmail.com',
      link: 'mailto:lokanadhammanikanta111@gmail.com',
    },
    {
      label: 'LinkedIn',
      icon: 'linkedin',
      link: 'https://www.linkedin.com/in/manikanta-lokanadhamm/',
    },
    {
      label: 'Behance',
      icon: 'behance',
      link: 'https://www.behance.net/Manikanta-Lokanadham',
    },
    {
      label: 'Blog',
      icon: 'wordpress',
      link: 'https://mkedito.wordpress.com/',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8">Contact</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Coming soon...
        </p>
      </div>
    </section>
  );
} 