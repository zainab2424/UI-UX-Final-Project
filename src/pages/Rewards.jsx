import { useState } from 'react'
// Destructuring the new progress values from AppContext
import { useApp } from '../context/AppContext' 
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Modal from '../components/Modal'

// --- Figma Color and Style Mappings ---
const BG_PAGE = "bg-[#F8EDF7]"               
const BG_MAUVE_85 = "bg-[#C9A9FF] bg-opacity-[.85]"
const BG_JASMINE_85 = "bg-[#FFEE9F] bg-opacity-[.85]"
const BG_CARD_YELLOW = "bg-[#FFEE9F]"        
const TEXT_DARK_PURPLE = "text-[#7940C8]"    
const BORDER_DARK_PURPLE = "border-[#7940C8]"
const TEXT_PINK = "text-[#FF8AD8]"           
const BG_SKY_BLUE = "bg-[#7EC8F5]"           
const BG_PINK = "bg-[#FF8AD8]"               
const TEXT_YELLOW_ACCENT = "text-[#FFE981]"  
const BG_LIGHT_PINK = "bg-[#FFE9F8]"         

// --- Constants for Rewards ---
const INSPIRATIONAL_QUOTES = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
  "Strive for progress, not perfection. - Unknown",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The mind is not a vessel to be filled, but a fire to be kindled. - Plutarch"
]

const BADGES = [
  { name: "First Step", emoji: "🐣", requiredLevel: 1, description: "Unlocked at Level 1: Start your journey!" },
  { name: "Dedicated Learner", emoji: "📚", requiredLevel: 2, description: "Unlocked at Level 2: Complete your first set of challenges." },
  { name: "Mid-Level Mastery", emoji: "🌟", requiredLevel: 3, description: "Unlocked at Level 3: Halfway to the top!" },
  { name: "Consistent Crusher", emoji: "🏆", requiredLevel: 4, description: "Unlocked at Level 4: Maintain a streak." },
  { name: "Ultimate Champion", emoji: "👑", requiredLevel: 5, description: "Unlocked at Level 5: You are a true study master!" },
]

function Rewards() {
  // Destructure new progress variables from context
  const { points, level, completedChallenges, completeChallenge, currentProgress, pointsNeededForLevelUp, progressPercentage } = useApp()
  const [modal, setModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    type: 'success',
    theme: { bg: BG_MAUVE_85, titleColor: '#F8EDF7', messageColor: TEXT_DARK_PURPLE }
  })
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

  // UPDATED: Changed points for each challenge
  const [challenges] = useState([
    { id: 1, title: 'Challenge 1: Quick Start', description: 'Complete 3 tasks before noon!', points: 75 },
    { id: 2, title: 'Challenge 2: Deep Focus', description: 'Study for 25 minutes without checking your phone.', points: 100 },
    { id: 3, title: 'Challenge 3: Review King', description: 'Review notes from one past lecture.', points: 80 },
    { id: 4, title: 'Challenge 4: Practice Makes Perfect', description: 'Complete one practice problem from any subject.', points: 120 },
    { id: 5, title: 'Challenge 5: Summarizer', description: 'Summarize a chapter in 3 bullet points.', points: 90 },
    { id: 6, title: 'Challenge 6: Focused Reading', description: 'Read for 15 minutes with full focus.', points: 65 }
  ])

  const handleCompleteChallenge = (challengeId, pointsAwarded) => {
    const success = completeChallenge(challengeId, pointsAwarded)
    if (success) {
      setModal({
        isOpen: true,
        title: 'Challenge Completed! 🎉',
        message: `You earned ${pointsAwarded} points!`,
        type: 'success',
        theme: { bg: BG_MAUVE_85, titleColor: '#F8EDF7', messageColor: TEXT_DARK_PURPLE }
      })
    } else {
      setModal({
        isOpen: true,
        title: 'Already Completed ℹ️',
        message: 'This challenge has already been completed!',
        type: 'info',
        theme: { bg: BG_JASMINE_85, titleColor: TEXT_DARK_PURPLE, messageColor: TEXT_DARK_PURPLE }
      })
    }
  }

  const handleNextQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % INSPIRATIONAL_QUOTES.length)
  }

  const nextLevel = level + 1
  // Use the progress percentage directly from the context
  const progressPercent = progressPercentage
  
  // Custom Class for large number boxes
  const LargeStatBoxClasses = `box-border w-full h-[180px] ${BG_PAGE} border-2 ${BORDER_DARK_PURPLE} rounded-[16px] flex flex-col justify-center items-center p-4`
  
  // Custom Class for improved quote box styling
  const QuoteBoxClasses = `bg-[#7940C8] border-4 ${BORDER_DARK_PURPLE} rounded-[16px] p-3 text-center cursor-pointer transition-all duration-150 ease-in-out hover:opacity-90`

  return (
    <div className={`min-h-screen ${BG_PAGE} font-jomhuria text-dark-purple`}>
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-10 py-8 space-y-6">
        
        <section className="pb-4">
          <h1 
            className={`text-[110px] font-jomhuria text-[#C9A9FF] leading-[110px] tracking-[0.03em] mb-1`} 
            style={{
              // RESTORED: Main heading stroke outline back to dark purple (#7940C8)
              textShadow: `-2px -2px 0 #7940C8, 2px -2px 0 #7940C8, -2px 2px 0 #7940C8, 2px 2px 0 #7940C8, 0px 4px 4px rgba(0,0,0,0.25)`
            }}
          >
            Challenges & Rewards
          </h1>
          <p className={`text-[50px] font-jomhuria ${TEXT_DARK_PURPLE} leading-[50px] ml-4 mt-2`}>
            How dedicated are you ?
          </p>
        </section>

        <div className="space-y-6">

          <section 
            className={`${BG_MAUVE_85} border-2 ${BORDER_DARK_PURPLE} rounded-[16px] shadow-lg p-6`}
          >
            {/* Challenges heading color is #804ACB */}
            <h2 className={`text-[80px] font-jomhuria text-[#804ACB] leading-[80px] mb-6`}>
              Challenges !
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              {challenges.map((challenge) => {
                const isCompleted = completedChallenges.includes(challenge.id)
                const buttonClasses = `bg-[#C9A9FF] border-2 border-[#FFEE9F] rounded-[16px] w-[80px] h-[80px] p-5 flex justify-center items-center hover:opacity-90 transition-opacity`
                
                return (
                  <div 
                    key={challenge.id} 
                    // NO GREEN BACKGROUND ON COMPLETION - just opacity
                    className={`${BG_CARD_YELLOW} border-2 ${BORDER_DARK_PURPLE} rounded-[16px] p-4 flex relative h-[160px] ${isCompleted ? 'opacity-60' : ''} transition-opacity duration-300`}
                  >
                    
                    <div className="flex flex-col justify-center h-full pl-4 pr-[120px] overflow-hidden">
                      <h3
                        className={`text-[45px] font-jomhuria ${TEXT_DARK_PURPLE} leading-[45px] tracking-[0.03em] mb-1 truncate`}
                        style={{ textShadow: '0px 2px 2px rgba(255, 138, 216, 0.4)' }}
                      >
                        {challenge.title}
                      </h3>
                      <p className={`text-[35px] font-jomhuria ${TEXT_DARK_PURPLE} leading-[35px] mb-2 overflow-hidden text-ellipsis whitespace-nowrap`}>
                        {challenge.description}
                      </p>
                    </div>
                    
                    {/* Points Text: MOVED TO BOTTOM RIGHT */}
                    <div className="absolute right-[18px] bottom-[16px] text-right">
                      <p className={`text-[35px] font-jomhuria ${TEXT_PINK} leading-[35px]`}>
                        + {challenge.points} Points
                      </p>
                    </div>

                    {/* Checkbox Button Position */}
                    <div className="absolute right-[18px] top-[18px]">
                      {!isCompleted ? (
                        <button 
                          onClick={() => handleCompleteChallenge(challenge.id, challenge.points)}
                          className={buttonClasses}
                        >
                          <span className="text-white text-2xl"></span> 
                        </button>
                      ) : (
                        <div className={`${buttonClasses} bg-[#7940C8]`}>
                          <span className="text-white text-3xl">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section 
            // Consistent outline with the Challenges section
            className={`${BG_JASMINE_85} border-2 ${BORDER_DARK_PURPLE} rounded-[16px] shadow-lg p-6`}
          >
            {/* Rewards heading color is #804ACB */}
            <h2 
              className={`text-[80px] font-jomhuria text-[#804ACB] leading-[80px] mb-6`}
              style={{ textShadow: '0px 4px 4px rgba(255, 253, 253, 0.25)' }}
            >
              Rewards !
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 mb-6">
              <div className={LargeStatBoxClasses}>
                <p className={`text-[55px] font-jomhuria ${TEXT_DARK_PURPLE} leading-[60px] -mt-6`}>
                  Total Points
                </p>
                <p className={`text-[100px] font-jomhuria ${TEXT_PINK} leading-[60px] mt-1`}>
                  {points}
                </p>
              </div>

              <div className={LargeStatBoxClasses}>
                <p className={`text-[55px] font-jomhuria ${TEXT_DARK_PURPLE} leading-[60px] -mt-6`}>
                  Current Level
                </p>
                <p className={`text-[100px] font-jomhuria ${TEXT_PINK} leading-[60px] mt-1`}>
                  {level}
                </p>
              </div>
            </div>

            <div 
              className={`${BG_SKY_BLUE} border-2 ${BORDER_DARK_PURPLE} rounded-[16px] p-4 mb-6`}
            >
              {/* Progress Label Row - Using context values */}
              <div className="flex justify-between items-center mb-3">
                <span 
                  className={`text-[50px] font-jomhuria text-[#F8EDF7] leading-[50px]`}
                  style={{ textShadow: `2px 2px 0 ${TEXT_DARK_PURPLE}` }}
                >
                  Progress to Level {level + 1}
                </span>
                <span 
                  className={`text-[50px] font-jomhuria ${TEXT_DARK_PURPLE} ${BG_CARD_YELLOW} px-3 rounded-full leading-[50px]`}
                  style={{ border: `2px solid ${BORDER_DARK_PURPLE}` }}
                >
                  {/* Using currentProgress and pointsNeededForLevelUp from context */}
                  {currentProgress}/{pointsNeededForLevelUp} pts
                </span>
              </div>
              
              {/* Progress Bar Track */}
              <div 
                className={`${BG_PAGE} border-4 ${BORDER_DARK_PURPLE} rounded-[16px] h-[40px] overflow-hidden`}
              >
                <div 
                  className={`${BG_PINK} h-full transition-all duration-500 ease-out`}
                  style={{ 
                    // Using progressPercent from context
                    width: `${progressPercent}%`, 
                    borderRight: progressPercent < 100 ? `4px solid ${BORDER_DARK_PURPLE}` : 'none' 
                  }}
                ></div>
              </div>
            </div>

            {/* Quote Box (Motivational Banner) */}
            <div 
              className={`${QuoteBoxClasses} mb-6`}
              onClick={handleNextQuote}
            >
              <p 
                className={`text-[55px] font-jomhuria ${TEXT_YELLOW_ACCENT} leading-[60px] tracking-[0.04em] transition-all duration-300 ease-in-out`}
                // Pink outline using your brand pink (#FF8AD8)
                style={{
                  textShadow: `
                    -1px -1px 0 #FF8AD8,
                     1px -1px 0 #FF8AD8,
                    -1px  1px 0 #FF8AD8,
                     1px -1px 0 #FF8AD8
                  `
                }}
              >
                {INSPIRATIONAL_QUOTES[currentQuoteIndex]}
              </p>
            </div>

            {/* Badges Box */}
            <div 
              className={`${BG_LIGHT_PINK} border-2 border-[#6734AE] rounded-[16px] p-6`}
            >
              <h3 className={`text-[55px] font-jomhuria ${TEXT_DARK_PURPLE} leading-[60px] mb-3`}>
                Badges
              </h3>
              <div className="flex gap-6 justify-start pt-3">
                {BADGES.map((badge) => {
                  const isUnlocked = level >= badge.requiredLevel
                  const badgeClasses = isUnlocked 
                    ? "text-6xl hover:scale-110 transition-transform cursor-pointer" 
                    : "text-6xl opacity-30 grayscale cursor-not-allowed"

                  return (
                    <div key={badge.name} className="relative group">
                      <span className={badgeClasses}>{badge.emoji}</span>
                      {/* Tooltip - INCREASED SIZE/PADDING */}
                      <div 
                        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-5 py-3 text-xl rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${BG_MAUVE_85} ${TEXT_DARK_PURPLE} border-2 ${BORDER_DARK_PURPLE}`}
                      >
                        {badge.description}
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#C9A9FF]"></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        theme={modal.theme} 
      />

      <Footer />
    </div>
  )
}

export default Rewards
