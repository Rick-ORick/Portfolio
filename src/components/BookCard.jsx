//BookCard.jsx
import { Link } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'
import { motion } from 'framer-motion'

export default function BookCard({ book }) {
  const { addBook, library, toggleFavorite } = useLibrary()
  const info = book.volumeInfo

  const isInLibrary = library.some((b) => b.id === book.id)
  const isFavorite = library.find((b) => b.id === book.id)?.favorite

  // Construct Amazon search link
  const amazonSearchQuery = encodeURIComponent(`${info.title} ${info.authors?.join(' ')}`)
  const amazonLink = `https://www.amazon.com/s?k=${amazonSearchQuery}`

  return (
    <motion.div
      className="p-4 rounded-xl shadow-xl bg-neutral-800 flex flex-col justify-between h-full border border-neutral-700 hover:border-fuchsia-500 transition-all duration-300 transform hover:scale-[1.03]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h3 className="text-lg font-extrabold mb-1 text-fuchsia-400">{info.title}</h3>
        <p className="text-xs text-neutral-400 mb-2">
          {info.authors?.join(', ') || 'Unknown Author'}
        </p>
        {info.imageLinks?.thumbnail && (
          <img
            src={info.imageLinks.thumbnail}
            alt={info.title}
            className="w-full max-h-48 object-contain my-3 mx-auto shadow-lg rounded"
          />
        )}
      </div>

      <div className="mt-4 space-y-2">
        {/* Amazon Buy Button - New Requirement */}
        <a
          href={amazonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-2 bg-yellow-500 hover:bg-yellow-600 text-neutral-900 rounded font-bold text-sm transition-colors duration-300"
        >
          Buy on Amazon 🛒
        </a>
        
        <div className='flex justify-between items-center'>
            <button
                className={`px-3 py-1 rounded text-sm ${
                    isInLibrary ? 'bg-neutral-600 cursor-not-allowed text-neutral-400' : 'bg-green-600 hover:bg-green-700 text-white'
                } font-medium`}
                onClick={() => {
                    if (!isInLibrary) {
                        addBook(book)
                    }
                }}
                disabled={isInLibrary}
            >
                {isInLibrary ? 'In Library' : 'Add to Library'}
            </button>

            <Link
                to={`/book/${book.id}`}
                className="px-3 py-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded text-sm font-medium"
            >
                Details
            </Link>

            {isInLibrary && (
                <span
                    onClick={() => toggleFavorite(book.id)}
                    className={`text-2xl cursor-pointer transition-transform ${
                        isFavorite ? 'text-yellow-400 scale-125' : 'text-neutral-500 hover:text-yellow-300'
                    }`}
                >
                    ★
                </span>
            )}
        </div>
      </div>
    </motion.div>
  )
}
