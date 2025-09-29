//BookDetail.jsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getBookById } from '../services/bookAPI'
import { motion } from 'framer-motion'

export default function BookDetail() {
  const { id } = useParams()
  const [book, setBook] = useState(null)

  useEffect(() => {
    getBookById(id).then(setBook)
  }, [id])

  if (!book) return <p className="p-6 pt-24 text-center">Loading...</p>

  const info = book.volumeInfo
  const amazonSearchQuery = encodeURIComponent(`${info.title} ${info.authors?.join(' ')}`)
  const amazonLink = `https://www.amazon.com/s?k=${amazonSearchQuery}`

  return (
    <motion.div 
      className="p-6 pt-24 max-w-4xl mx-auto bg-neutral-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-8 bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
        
        <div className="flex-shrink-0 md:w-1/3 flex justify-center">
          <img
            src={info.imageLinks?.thumbnail}
            alt={info.title}
            className="mb-4 shadow-xl rounded-lg w-full max-w-xs md:max-w-none"
          />
        </div>

        <div className="md:w-2/3">
          <h2 className="text-4xl font-extrabold mb-2 text-fuchsia-400">{info.title}</h2>
          <p className="text-lg text-neutral-300 mb-4">
            By <span className="font-semibold">{info.authors?.join(', ') || 'Unknown Author'}</span>
          </p>

          <a
            href={amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-neutral-900 rounded font-bold mb-6 shadow-lg transition-colors duration-300"
          >
            Buy on Amazon 🛒
          </a>

          <h3 className="text-xl font-bold mt-4 mb-2 text-white border-b border-neutral-600 pb-1">Description</h3>
          <div
            className="text-neutral-400 text-base leading-relaxed max-h-60 overflow-y-auto pr-2"
            dangerouslySetInnerHTML={{ __html: info.description || '<em>No description available.</em>' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
