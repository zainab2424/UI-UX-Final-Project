import { Link, useLocation } from 'react-router-dom'
import logo from '../images/logo.jpg'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="w-full h-[104px] bg-purple flex items-center justify-between px-[60px] shadow-lg">
      <div className="flex items-center gap-2">
        <img 
          src={logo} 
          alt="Pixel Quest Logo" 
          className="w-[60px] h-[60px] rounded-md border-2 border-dark-purple object-cover"
        />
        <h1 className="text-4xl font-jomhuria text-dark-purple">Pixel Quest</h1>
      </div>

      <div className="flex items-center gap-8">
        <Link 
          to="/" 
          className={`text-4xl font-jomhuria ${
            location.pathname === '/' 
              ? 'text-pink'     // highlighted page
              : 'text-dark-purple' // default nav color
          }`}
        >
          Home
        </Link>

        <Link 
          to="/track" 
          className={`text-4xl font-jomhuria ${
            location.pathname === '/track' 
              ? 'text-pink'
              : 'text-dark-purple'
          }`}
        >
          Track
        </Link>

        <Link 
          to="/rewards" 
          className={`text-4xl font-jomhuria ${
            location.pathname === '/rewards' 
              ? 'text-pink'
              : 'text-dark-purple'
          }`}
        >
          Rewards
        </Link>
      </div>
    </nav>
  )
}

export default Navbar


