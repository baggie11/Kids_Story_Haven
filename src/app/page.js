"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: '📚',
      title: '2,000+ Short Stories',
      description: 'Curated collection for all age groups and reading levels'
    },
    {
      icon: '👪',
      title: 'Parent-Child Bonding',
      description: 'Perfect platform for parents to read with their children'
    },
    {
      icon: '🧒',
      title: 'Age-Appropriate Content',
      description: 'Kids can independently read stories matched to their level'
    },
    {
      icon: '🔍',
      title: 'Vocabulary Builder',
      description: 'Interactive tools to help expand your child\'s word knowledge'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Head>
        <title>Kids Story Haven | Fun Reading for Children</title>
        <meta name="description" content="2000+ stories to help kids learn and grow" />
      </Head>

      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-200 text-4xl opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 40 - 20],
              x: [0, Math.random() * 40 - 20],
              transition: {
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }
            }}
          >
            {['📖', '🌟', '✨', '📘', '👪'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span className="text-4xl mr-2">📖</span>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Kids Story Haven
            </span>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/stories">Start Reading</Link>
          </motion.button>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-10 md:mb-0"
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                Where Stories Come Alive
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover the joy of reading with our vast collection of 2,000+ stories. 
              Designed for parents to read with children or for young readers to explore independently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full shadow-lg text-lg font-medium"
              >
                <Link href="/stories">Explore Stories</Link>
              </motion.button>
              
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  transition: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="relative z-10"
              >
               
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -bottom-5 -left-5 bg-white p-3 rounded-xl shadow-lg border-2 border-purple-100"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">📚</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">2,000+ Stories</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -top-5 -right-5 bg-white p-3 rounded-xl shadow-lg border-2 border-blue-100"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">🔍</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Vocabulary Helper</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Designed for Growing Readers
            </span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col items-center text-center"
                whileHover={{ y: -5 }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-purple-600">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="mb-24 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                  className="text-8xl mb-6 text-center md:text-left"
                >
                  {features[currentFeature].icon}
                </motion.div>
                <motion.h3
                  key={`title-${currentFeature}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold mb-4 text-purple-600 text-center md:text-left"
                >
                  {features[currentFeature].title}
                </motion.h3>
                <motion.p
                  key={`desc-${currentFeature}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl text-gray-600 mb-6 text-center md:text-left"
                >
                  {features[currentFeature].description}
                </motion.p>
              </AnimatePresence>
              <div className="flex justify-center md:justify-start space-x-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${currentFeature === index ? 'bg-purple-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-64 md:h-80 w-full bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl overflow-hidden border border-gray-200"
              >
                <motion.img
                  src="/images/pic1.png"
                  alt="Reading interface demo"
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md flex items-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >

                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-8"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Start Your Reading Journey Today
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of families who are making reading fun and educational with our story platform.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full shadow-lg text-lg font-medium"
          >
            <Link href="/stories">Get Started - It's Free</Link>
          </motion.button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <span className="text-3xl mr-2">📖</span>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                Kids Story Haven
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="#" className="text-gray-600 hover:text-purple-600">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-purple-600">Terms</a>
              <a href="#" className="text-gray-600 hover:text-purple-600">Contact</a>
              <a href="#" className="text-gray-600 hover:text-purple-600">FAQ</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500">
            © {new Date().getFullYear()} Kids Story Haven. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}