import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import heroImage from '../images/hero.jpg'
import testimonial1 from '../images/testimonial-1.jpg'
import testimonial2 from '../images/testimonial-2.jpg'
import testimonial3 from '../images/testimonial-3.jpg'
import client1 from '../images/client-1.jpg'
import client2 from '../images/client-2.jpg'
import client3 from '../images/client-3.jpg'
import client4 from '../images/client-4.jpg'
import client5 from '../images/client-5.jpg'
import client6 from '../images/client-6.jpg'



function Home() {
  const { points, level, badge } = useApp()

  return (
    // Home Page - Base mobile padding px-4, increasing to px-8 on medium screens
    <div className="min-h-screen bg-light-pink">
      {/* Navbar (Kept outside for component-specific responsiveness) */}
      <Navbar />

      {/* Hero Section - REDUCED VERTICAL PADDING: py-4 md:py-6 */}
      <section className="w-full bg-gradient-to-r from-yellow via-pink to-light-sky-blue py-4 md:py-6 px-4 md:px-8 relative">
        {/* Main content container. Uses flex-col on mobile, flex-row on medium screens and up */}
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:justify-between items-center md:items-start gap-6 md:gap-10">
          
          {/* Title and Call to Action (Left side) */}
          <div className="flex flex-col gap-3 md:gap-4 text-center md:text-left">
            {/* Welcome to Pixel Quest - REDUCED FONT SIZE: text-4xl sm:text-5xl lg:text-[110px] */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-[110px] font-jomhuria text-soft-purple leading-none tracking-[0.03em] text-center md:text-left"
              style={{
                textShadow: `-2px -2px 0 #7940C8, 2px -2px 0 #7940C8, -2px 2px 0 #7940C8, 2px 2px 0 #7940C8, 0px 4px 4px rgba(0,0,0,0.25)` // Added the 2px stroke and kept the drop-shadow
              }}
            >
              Welcome to Pixel Quest
            </h1>
            {/* Level Up Your Life! - REDUCED FONT SIZE: text-3xl sm:text-4xl lg:text-[50px] */}
            <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-jomhuria text-dark-purple leading-none">
              Level Up Your Life!
            </h2>
            {/* Call to Action Button - REDUCED SIZE: h-[50px] and smaller text */}
            <Link to="/track">
              <button className="bg-pink border-4 border-[#E06CBA] rounded-[20px] px-6 py-2 text-2xl font-jomhuria text-dark-purple shadow-[8px_8px_4px_#DFADCE] hover:shadow-xl transition-shadow w-auto h-[50px] flex items-center justify-center text-center mx-auto md:mx-0">
                Start Tracking
              </button>
            </Link>
          </div>
          
          {/* User Summary (Right side) - REDUCED WIDTH AND HEIGHT */}
          <div className="flex flex-col gap-3 w-full sm:w-[250px] mt-4 md:mt-0 items-center">
            {/* Total Points Button - REDUCED HEIGHT AND TEXT SIZE: h-[65px] text-3xl */}
            <div className="bg-yellow border-4 border-[#EBC615] rounded-2xl px-6 py-2 text-3xl font-jomhuria text-dark-purple shadow-[6px_8px_4px_#CD90B9] h-[65px] flex items-center justify-center w-full">
              ✦ {points} Points
            </div>
            {/* Level and Badge Buttons - REDUCED HEIGHT AND TEXT SIZE: h-[65px] text-3xl */}
            <div className="flex gap-3 w-full">
              {/* Current Level Button */}
              <div className="bg-purple border-4 border-dark-purple rounded-2xl px-6 py-2 text-3xl font-jomhuria text-dark-purple shadow-[6px_8px_4px_#CD90B9] h-[65px] w-1/2 flex items-center justify-center">
                Lvl. {level}
              </div>
              {/* Recent Badge Button - Changed to the Level 1 badge (🐣) for initial consistency */}
              <div className="bg-light-sky-blue border-4 border-[#14699D] rounded-2xl px-6 py-2 text-3xl font-jomhuria text-black shadow-[6px_8px_4px_#CD90B9] h-[65px] w-1/2 flex items-center justify-center">
                {badge}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Container - REDUCED VERTICAL PADDING: py-3 md:py-4 */}
      <section className="w-full py-3 md:py-4 px-4 md:px-8 bg-[#FF8AD8] border-y-3 border-dark-purple">
        <div className="max-w-[1440px] mx-auto">
          {/* Study Banner - REDUCED HEIGHT: h-[150px] sm:h-[250px] md:h-[350px] lg:h-[420px] */}
          <div className="w-full h-[150px] sm:h-[250px] md:h-[350px] lg:h-[420px] rounded-2xl border-3 border-dark-purple shadow-[10px_10px_4px_rgba(0,0,0,0.25)] overflow-hidden">
            <img 
              src={heroImage} 
              alt="Hero section - Study workspace" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* About Us Section - REDUCED VERTICAL PADDING: py-10 md:py-12 */}
      <section className="w-full bg-light-pink py-10 md:py-12 px-4 md:px-8">
        <div className="max-w-[1440px] mx-auto">
          {/* About Pixel Quest - REDUCED FONT SIZE: text-4xl sm:text-5xl lg:text-6xl */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-jomhuria text-dark-purple mb-3 md:mb-4 leading-none text-center md:text-left">
            About Pixel Quest
          </h2>
          {/* About BGD - REDUCED PADDING: p-4 md:p-8 */}
          <div className="bg-light-sky-blue border-3 border-dark-purple rounded-2xl p-4 md:p-8 shadow-[10px_10px_4px_0px_rgba(0,0,0,0.25)]">
            {/* About Para - REDUCED FONT SIZE: text-xl md:text-2xl lg:text-3xl */}
            <p className="text-xl md:text-2xl lg:text-3xl font-jomhuria text-blue leading-tight text-center">
              Pixel Quest is a gamified productivity platform designed to make everyday tasks feel fun, rewarding, and motivating. We transform your goals into quests, your habits into streaks, and your progress into XP you can actually see. Whether you're studying, working, or building healthy routines, Pixel Quest helps you stay on track with a little adventure sprinkled in.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section - REDUCED VERTICAL PADDING: py-10 md:py-12 */}
      <section className="w-full bg-yellow border-y-3 border-dark-purple py-10 md:py-12 px-4 md:px-8 shadow-[10px_10px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="max-w-[1440px] mx-auto">
          {/* Testimonials Title - REDUCED FONT SIZE: text-4xl sm:text-5xl lg:text-6xl */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-jomhuria text-dark-purple mb-6 md:mb-8 text-center md:text-left leading-none">
            Testimonials
          </h2>
          {/* Testimonials BGD - REDUCED PADDING: p-4 md:p-8 */}
          <div className="bg-beige rounded-2xl p-4 md:p-8 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            
            {/* Testimonials Card Row - TIGHTER GAP: gap-4 md:gap-6 */}
            <div className="flex items-start justify-center gap-4 md:gap-6 flex-wrap filter drop-shadow-[-10px_10px_4px_rgba(0,0,0,0.25)]">
              
              {[
                { name: "Aisha R.", quote: "The rewards system is genius. It turns even boring chores into a game I want to win.", avatar: testimonial1 },
                { name: "Daniel K.", quote: "The quests keep me motivated every day. I've never stuck to a routine this long.", avatar: testimonial2 },
                { name: "Mina S.", quote: "Such a cute, simple concept — but it genuinely helped me get my life together.", avatar: testimonial3 }
              ].map((testimony, index) => (
                // Individual Testimonial Card container
                <div key={index} className="flex flex-col items-center w-full min-w-0 max-w-[300px] sm:max-w-[350px]">
                  {/* Avatar/Headshot - REDUCED SIZE: w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] */}
                  <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full overflow-hidden border-4 border-dark-purple -mb-[50px] z-10 bg-gray-300">
                    <img src={testimony.avatar} alt={testimony.name} className="w-full h-full object-cover"/>
                  </div>

                  {/* Testimonial Content Box (Purple box) - MIN HEIGHT REDUCED */}
                  <div className="bg-purple border-3 border-dark-purple rounded-2xl p-3 pt-14 w-full min-h-[280px] sm:min-h-[320px] flex flex-col items-center text-center">
                    
                    {/* Star Rating - centered */}
                    <div className="flex gap-1 mb-2">
                      <span className="text-xl">⭐⭐⭐⭐⭐</span>
                    </div>

                    {/* PINK CONTAINER for Quote and Name - Retained p-4 for internal quote padding */}
                    <div className="bg-pink rounded-lg p-3 w-full flex-grow flex flex-col justify-center items-center">
                        {/* Quote - REDUCED FONT SIZE: text-xl md:text-2xl */}
                        <p className="text-xl md:text-2xl font-jomhuria text-dark-purple leading-tight mb-2">
                            "{testimony.quote}"
                        </p>
                        {/* Name - REDUCED FONT SIZE: text-lg md:text-xl */}
                        <p className="text-lg md:text-xl font-jomhuria text-dark-purple mt-2">
                            — {testimony.name}
                        </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section - REDUCED VERTICAL PADDING: py-4 md:py-8 */}
      <section className="w-full py-4 md:py-8 px-4 md:px-8">
        <div className="max-w-[1440px] mx-auto">
          {/* Client box: Reduced padding p-5 md:p-6 */}
          <div className="bg-[#FF8AD8] border-3 border-dark-purple rounded-2xl p-5 md:p-6 shadow-[-10px_10px_4px_0px_rgba(0,0,0,0.25)] flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-0">
            
            {/* Client Label: Reduced height and text size */}
            <div className="bg-dark-purple rounded-2xl px-5 py-2 flex-shrink-0 h-auto md:h-[50px] flex items-center justify-center">
              <h3 className="text-3xl md:text-4xl font-jomhuria text-pink leading-none">Clients</h3>
            </div>
            
            {/* Sponsors (Image placeholders): Reduced size and spacing */}
            <div className="flex items-center justify-center w-full md:w-auto flex-wrap gap-4 sm:gap-6 md:gap-8">
            {[client1, client2, client3, client4, client5, client6].map((logo, i) => (
              <div
                key={i}
                className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] 
                          rounded-xl border-2 border-gray-400 shadow-md transform rotate-[0.49deg] 
                          overflow-hidden flex-shrink-0 bg-white"
              >
                <img
                  src={logo}
                  alt={`Client ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            </div>
          </div>
        </div>
      </section>

      {/* Footer (Kept outside for component-specific responsiveness) */}
      <Footer />
    </div>
  )
}

export default Home
