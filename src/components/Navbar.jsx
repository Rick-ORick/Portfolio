//Navbar.jsx
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-base uppercase tracking-widest px-4 py-2 rounded font-medium transition-colors duration-300
        ${pathname === to ? 'text-fuchsia-400 border-b-2 border-fuchsia-400' : 'text-neutral-200 hover:text-fuchsia-300'}`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="w-full p-4 bg-neutral-900 fixed top-0 left-0 z-40 border-b border-neutral-700 shadow-xl">
      <div className="max-w-6xl w-full flex justify-between items-center mx-auto px-4">
        <Link to="/" className="text-2xl font-extrabold text-fuchsia-400 tracking-tight text-glow">
          BookVerse
        </Link>
        <div className="flex gap-6">
          {navLink('/', 'Home')}
          {navLink('/search', 'Search')}
          {navLink('/library', 'Library')}
        </div>
      </div>
    </nav>
  )
}
