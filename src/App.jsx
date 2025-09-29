// src/App.jsx
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import Library from './pages/Library'
import BookDetail from './pages/BookDetail'
import Navbar from './components/Navbar'
import OpeningAnimation from './components/OpeningAnimation'
import { LibraryProvider } from './context/LibraryContext'

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <LibraryProvider>
      {loading && <OpeningAnimation onFinish={() => setLoading(false)} />}
      <Router>
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/book/:id" element={<BookDetail />} />
          </Routes>
        </main>
      </Router>
    </LibraryProvider>
  )
}
