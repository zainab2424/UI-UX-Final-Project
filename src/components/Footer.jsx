import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";


function Footer() {
  const location = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [showAlert, setShowAlert] = useState({ isOpen: false, message: '', isSuccess: false })

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const handleSubscribe = (e) => {
    e.preventDefault()

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName || !trimmedEmail) {
      setShowAlert({
        isOpen: true,
        message: 'Please fill in both name and email fields.',
        isSuccess: false
      })
      setTimeout(() => setShowAlert({ isOpen: false, message: '', isSuccess: false }), 4000)
      return
    }

    if (!isValidEmail(trimmedEmail)) {
      setShowAlert({
        isOpen: true,
        message: 'Hmm… that email does not look right. Try something like name@example.com 😊',
        isSuccess: false
      })
      setTimeout(() => setShowAlert({ isOpen: false, message: '', isSuccess: false }), 4000)
      return
    }

    setShowAlert({ 
      isOpen: true, 
      message: `Thank you ${trimmedName}! You've been subscribed to our newsletter!`,
      isSuccess: true
    })
    setName('')
    setEmail('')
    setTimeout(() => setShowAlert({ isOpen: false, message: '', isSuccess: false }), 4000)
  }

  return (
    // FOOTER CONTAINER
    <footer className="w-full min-h-[158px] bg-light-sky-blue flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4">
      
      {/* 1. SOCIAL ICONS (Far Left) */}
      <div className="flex items-center gap-3 order-1">
        {/* Twitter */}
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[30px] h-[30px] bg-dark rounded flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
        >
          <FaTwitter className="text-white w-[20px] h-[20px]" />
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[30px] h-[30px] bg-dark rounded flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
        >
          <FaInstagram className="text-white w-[20px] h-[20px]" />
        </a>

        {/* YouTube */}
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[30px] h-[30px] bg-dark rounded flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
        >
          <FaYoutube className="text-white w-[20px] h-[20px]" />
        </a>

        {/* LinkedIn */}
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[30px] h-[30px] bg-dark rounded flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
        >
          <FaLinkedin className="text-white w-[20px] h-[20px]" />
        </a>

      </div>
      
      {/* 2. NAVIGATION LINKS (Center Left) */}
      <div className="flex items-center gap-6 order-2 mt-4 md:mt-0">
        <Link 
          to="/" 
          className={`text-4xl font-jomhuria hover:opacity-80 transition-opacity ${location.pathname === '/' ? 'text-dark-purple' : 'text-blue'}`}
        >
          Home
        </Link>
        <Link 
          to="/track" 
          className={`text-4xl font-jomhuria hover:opacity-80 transition-opacity ${location.pathname === '/track' ? 'text-dark-purple' : 'text-blue'}`}
        >
          Track
        </Link>
        <Link 
          to="/rewards" 
          className={`text-4xl font-jomhuria hover:opacity-80 transition-opacity ${location.pathname === '/rewards' ? 'text-dark-purple' : 'text-blue'}`}
        >
          Rewards
        </Link>
      </div>

      {/* 3. NEWSLETTER FORM (Far Right) */}
      <form
        onSubmit={handleSubscribe}
        noValidate
        className="flex flex-col items-end gap-1 w-full md:w-auto order-3 mt-4 md:mt-0"
      >
        <p 
          className="text-[35px] md:text-[50px] font-jomhuria text-pink text-right w-full md:w-auto"
          style={{ textShadow: '-2px -2px 0 #E06CBA, 2px -2px 0 #E06CBA, -2px 2px 0 #E06CBA, 2px 2px 0 #E06CBA' }}
        >
          Sign up to receive our productivity newsletter!
        </p>
        
        <div className="flex items-center justify-end gap-3 w-full flex-wrap sm:flex-nowrap">
          <input
            type="text"
            placeholder="Enter Name. . ."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[180px] h-[55px] bg-light-pink border-4 border-dark-purple rounded-[15px] px-[15px] text-[28px] font-jomhuria text-dark-purple placeholder-dark-purple flex-shrink-0"
          />
          <input
            type="email"
            placeholder="Enter Email. . ."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[300px] h-[55px] bg-light-pink border-4 border-dark-purple rounded-[15px] px-[15px] text-[28px] font-jomhuria text-dark-purple placeholder-dark-purple flex-shrink-0"
          />
          <button 
            type="submit"
            className="w-[160px] h-[55px] bg-cream border-4 border-jasmine-yellow rounded-2xl px-[10px] py-[8px] text-[40px] font-jomhuria text-dark-purple shadow-[5px_5px_4px_0px_rgba(131,62,108,1)] hover:opacity-90 transition-opacity flex items-center justify-center flex-shrink-0"
          >
            SUBSCRIBE
          </button>
        </div>
      </form>

      {showAlert.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className={`p-6 rounded-2xl shadow-2xl w-full max-w-sm font-jomhuria border-4 ${showAlert.isSuccess ? 'bg-[#FFE981] border-[#7940C8]' : 'bg-red-200 border-red-700'}`}>
            <h2 className={`text-[50px] leading-[50px] mb-2 ${showAlert.isSuccess ? 'text-[#7940C8]' : 'text-red-800'}`}>
              {showAlert.isSuccess ? 'Success!' : 'Error!'}
            </h2>
            <p className={`text-[35px] leading-[35px] mb-4 ${showAlert.isSuccess ? 'text-[#7940C8]' : 'text-red-800'}`}>
              {showAlert.message}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAlert({ isOpen: false, message: '', isSuccess: false })}
                className="bg-[#FF8AD8] border-2 border-[#7940C8] rounded-[10px] px-4 py-1 text-[35px] font-jomhuria text-white hover:opacity-80 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer

