import { useState, useEffect, useRef } from 'react'
import { searchBooks } from '../services/bookAPI'
import BookCard from '../components/BookCard'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// Utility function to format the bot's reply with links
const parseAndLinkGPTReply = (content) => {
  // Regex to find 'BOOK_SUGGESTION: Title - Author'
  const bookRegex = /BOOK_SUGGESTION:\s*([^-]+)\s*-\s*(.+)/g
  
  // Find book suggestions and replace them with Amazon links
  let linkedContent = content.replace(bookRegex, (match, title, author) => {
    // Basic formatting for a search query on Amazon. Use ISBN/ASIN for better results.
    const amazonSearchQuery = encodeURIComponent(`${title} ${author}`)
    const amazonLink = `https://www.amazon.com/s?k=${amazonSearchQuery}`
    
    return `<a href="${amazonLink}" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:text-sky-300 font-semibold underline">Buy/View: ${title} by ${author}</a>`
  })

  // Add link to the local search page for general searches
  const searchRegex = /search for (.+)/gi
  linkedContent = linkedContent.replace(searchRegex, (match, query) => {
    const searchUrl = `/search?q=${encodeURIComponent(query.trim())}`
    return `<a href="${searchUrl}" class="text-fuchsia-400 hover:text-fuchsia-300 font-semibold underline">search for ${query.trim()}</a>`
  })
  
  // Convert basic newlines to <br> for better formatting in innerHTML
  linkedContent = linkedContent.replace(/\n/g, '<br />')

  return linkedContent
}

// Bot Message component to handle dynamic rendering
const BotMessage = ({ content }) => {
  const linkedContent = parseAndLinkGPTReply(content)
  
  return (
    <span 
      className="inline-block px-4 py-2 rounded-lg bg-fuchsia-100 text-neutral-800 text-left shadow-lg animate-fadeIn" 
      dangerouslySetInnerHTML={{ __html: linkedContent }} 
    />
  )
}


export default function Search() {
  const [query, setQuery] = useState(() => localStorage.getItem('bookverse-query') || '')
  const [results, setResults] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const searchInputRef = useRef(null)
  
  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      handleSearch(urlQuery);
    } else if (query) {
      handleSearch(query);
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return

    localStorage.setItem('bookverse-query', searchQuery)
    setIsLoading(true)
    const books = await searchBooks(searchQuery)
    setResults(books || [])
    setIsLoading(false)
  }

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage = { role: 'user', content: input }
    const updated = [...messages, userMessage]
    setMessages(updated)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated })
      })

      const data = await response.json()
      const botReply = data.reply || 'No response'
      setMessages([...updated, { role: 'assistant', content: botReply }])
    } catch (err) {
      console.error('[BookVerse] Chat error:', err)
      setMessages([...updated, { role: 'assistant', content: 'Something went wrong.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <motion.div
      className="p-6 pt-24 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-10 flex flex-col items-center glow-border">
        <h2 className="text-3xl font-extrabold text-white mb-4 text-glow">Search the BookVerse</h2>
        <div className="flex w-full md:w-3/4 gap-2">
          <input
            ref={searchInputRef}
            type="text"
            className="p-3 rounded-l-lg border-2 border-fuchsia-500 bg-neutral-900 text-white w-full focus:outline-none focus:ring-2 focus:ring-fuchsia-400 placeholder-neutral-500"
            placeholder="Search for books or authors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <button 
            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-3 rounded-r-lg font-semibold" 
            onClick={() => handleSearch()}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search 🔍'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
        {results.length > 0 ? (
          results.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 col-span-full text-center py-10"
          >
            {isLoading ? 'Loading search results...' : 'Start by searching for a book or author!'}
          </motion.p>
        )}
      </div>

      <div className="mt-10 mx-auto w-full max-w-4xl border-t-2 border-fuchsia-600 pt-6">
        <h2 className="text-2xl font-extrabold mb-4 text-fuchsia-400 flex items-center justify-center">
          <span className="text-glow">⚡️ BookVerse AI Assistant ⚡️</span>
        </h2>
        <div className="bg-neutral-800 rounded-xl shadow-2xl p-6 border border-fuchsia-500/50">
          <div className="h-64 overflow-y-auto p-4 rounded-lg mb-4 bg-neutral-900 border border-neutral-700 space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <span className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md">
                    {msg.content}
                  </span>
                ) : (
                  <BotMessage content={msg.content} />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSend() }}>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 p-3 rounded-l-lg text-neutral-900 border-2 border-neutral-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 placeholder-neutral-500"
              placeholder="Ask something about books (e.g., 'Suggest a sci-fi book' or 'search for Dune')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-3 rounded-r-lg font-semibold flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
