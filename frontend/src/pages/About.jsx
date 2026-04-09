import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, BookOpen, Globe, ExternalLink, Mail } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.h1 
          className="text-5xl font-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          About <span className="text-green-600">CropGuard</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          We are dedicated to revolutionizing agriculture through accessible and powerful AI technology.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
         <motion.div 
           whileHover={{ y: -5 }}
           className="glass-card p-10 relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Target className="w-40 h-40 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3">
               <Target className="w-8 h-8 text-green-600" />
               <span>Our Mission</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
               Our goal is to provide small-scale and commercial farmers with a free, professional-grade tool to detect crop diseases early. By leveraging deep learning, we help reduce crop loss and minimize the unnecessary use of chemical pesticides.
            </p>
         </motion.div>

         <motion.div 
           whileHover={{ y: -5 }}
           className="glass-card p-10 relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <BookOpen className="w-40 h-40 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3">
               <BookOpen className="w-8 h-8 text-blue-600" />
               <span>How it Works</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
               Using a Convolutional Neural Network (CNN) trained on over 50,000 images, our system analyzes leaf patterns, spots, and discolorations. We also use Grad-CAM technology to explain which part of the leaf influenced the AI's decision.
            </p>
         </motion.div>
      </div>

      <div className="mb-24">
         <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center space-x-4">
            <Users className="w-8 h-8 text-emerald-600" />
            <span>Project Team</span>
         </h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
               <div key={i} className="glass-card p-6 text-center group">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 ring-4 ring-green-500/20 group-hover:ring-green-500/50 transition-all">
                     <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Team Member" />
                  </div>
                  <h3 className="font-bold text-xl mb-1">Developer {i}</h3>
                  <p className="text-sm text-gray-500 mb-6 font-medium">AI & Fullstack Engineer</p>
                  <div className="flex justify-center space-x-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                     <ExternalLink className="w-5 h-5 cursor-pointer hover:text-green-600 transition-colors" />
                     <ExternalLink className="w-5 h-5 cursor-pointer hover:text-blue-600 transition-colors" />
                     <Mail className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors" />
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="glass-card p-12 bg-green-600 text-white flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <Globe className="w-[500px] h-[500px] absolute -top-24 -left-20" />
          </div>
          <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
             <h2 className="text-4xl font-black mb-4">Support Indian Agriculture</h2>
             <p className="text-white/80 max-w-xl text-lg">
                Join us in building a more sustainable future for farming. 
                Our project is open-source and constantly evolving.
             </p>
          </div>
          <button className="relative z-10 px-8 py-4 bg-white text-green-600 font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all">
             Contact for Collaboration
          </button>
      </div>
    </div>
  );
};

export default About;
