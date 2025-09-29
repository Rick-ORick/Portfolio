//Library.jsx
import { useLibrary } from '../context/LibraryContext'
import { motion } from 'framer-motion'

export default function Library() {
  const { library, removeBook, toggleFavorite } = useLibrary()

  return (
    <motion.div 
      className="p-6 pt-24 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold mb-6 text-fuchsia-400 text-center">📚 My Personal Library</h2>

      {library.length === 0 ? (
        <p className="text-neutral-500 text-center text-lg mt-10">
          Your library is empty. Use the Search page to find and add some books!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {library.map((book) => (
            <motion.div 
              key={book.id} 
              className="p-4 border border-neutral-700 rounded-xl shadow-xl bg-neutral-800 flex text-left transition-transform hover:-translate-y-1 hover:shadow-fuchsia-500/30"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex-shrink-0 mr-4">
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail}
                  alt={book.volumeInfo.title}
                  className="w-20 h-auto object-cover rounded shadow-md"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-1 text-white">{book.volumeInfo.title}</h3>
                <p className="text-sm text-neutral-400 mb-2">
                  {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                </p>
                <div className="flex justify-between items-end mt-3">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
                    onClick={() => removeBook(book.id)}
                  >
                    Remove
                  </button>
                  <span
                    onClick={() => toggleFavorite(book.id)}
                    className={`text-3xl cursor-pointer transition-transform ${
                      book.favorite ? 'text-yellow-400 scale-125' : 'text-neutral-500 hover:text-yellow-300'
                    }`}
                  >
                    ★
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
