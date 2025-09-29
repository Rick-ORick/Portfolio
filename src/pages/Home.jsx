import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      delayChildren: 0.3, 
      staggerChildren: 0.2 
    } 
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

export default function Home() {
  return (
    <motion.div
      className="p-6 pt-36 max-w-4xl mx-auto text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-7xl font-extrabold mb-4 text-white uppercase tracking-tighter leading-none"
        variants={itemVariants}
      >
        <span className="text-fuchsia-500 text-glow">B</span>ook<span className="text-fuchsia-500 text-glow">V</span>erse
      </motion.h1>
      
      <motion.p className="mt-4 text-2xl text-neutral-300 font-light italic" variants={itemVariants}>
        Discover, save, and purchase your next favorite read.
      </motion.p>

      <motion.div 
        className="mt-20 border-t-2 border-fuchsia-600/50 pt-12 p-8 bg-neutral-800 rounded-xl shadow-2xl"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold mb-4 text-fuchsia-400">The Interactive Digital Library</h2>
        <p className="text-neutral-400 text-lg leading-relaxed">
          BookVerse is a high-fidelity, AI-assisted virtual library experience. We combine vast search capabilities with a sleek, interactive interface powered by <span className="font-semibold text-white">React</span> and <span className="font-semibold text-white">framer-motion</span>. 
          Ask our <span className="text-fuchsia-300">AI Assistant</span> for recommendations, find direct Amazon purchase links, and manage your personalized reading list.
        </p>

        <motion.div
          className="mt-6 inline-block"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a
            href="https://portfolio-git-main-ricks-projects-08c86335.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full font-bold shadow-xl hover:shadow-fuchsia-500/50 transition-all duration-300"
          >
            Check out the Portfolio
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
