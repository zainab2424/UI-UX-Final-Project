import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

// Constant for the required points per level
const LEVEL_POINTS_REQUIREMENT = 100;

export function AppProvider({ children }) {
  // FIX: Initialize points to 0 and level to 1 for new users
  const [points, setPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [completedChallenges, setCompletedChallenges] = useState([])
  
  // Initial habits and tasks remain the same
  const [habits] = useState([
    { id: 1, text: 'Study 2 hours after breakfast daily', completed: false },
    { id: 2, text: 'Update calendar before bed', completed: false }
  ])
  const [tasks] = useState([
    { id: 1, text: 'Complete Assignment 1', completed: false },
    { id: 2, text: 'Complete Quiz 2', completed: false },
    { id: 3, text: 'Complete UX Project', completed: false }
  ])

  // --- Level Progress Calculations ---
  // Points required to start the current level (e.g., Level 2 starts at 100)
  const pointsForCurrentLevelStart = (level - 1) * LEVEL_POINTS_REQUIREMENT
  
  // Points earned within the current level (0 to 99)
  const currentProgress = Math.max(0, points - pointsForCurrentLevelStart) // Use Math.max to prevent negative display
  
  // Total points needed to complete the current level (always 100)
  const pointsNeededForLevelUp = LEVEL_POINTS_REQUIREMENT;

  // Percentage completion
  const progressPercentage = Math.min((currentProgress / pointsNeededForLevelUp) * 100, 100)

  // Level up logic - level increases every 100 points
  useEffect(() => {
    const calculatedLevel = Math.floor(points / LEVEL_POINTS_REQUIREMENT) + 1
    if (calculatedLevel > level) {
      setLevel(calculatedLevel)
    }
  }, [points, level])

  // FIX: Use functional update to ensure state is updated reliably
  const completeChallenge = (challengeId, pointsAwarded) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges([...completedChallenges, challengeId])
      setPoints(prevPoints => prevPoints + pointsAwarded) // Functional update
      return true
    }
    return false
  }

  // FIX: Use functional update in all setters
  const toggleHabit = (habitId) => {
    setHabits(prevHabits => prevHabits.map(h => {
      if (h.id === habitId && !h.completed) {
        setPoints(prevPoints => prevPoints + 10) // Functional update
        return { ...h, completed: true }
      }
      return h
    }))
  }

  // FIX: Use functional update in all setters
  const toggleTask = (taskId) => {
    setTasks(prevTasks => prevTasks.map(t => {
      if (t.id === taskId && !t.completed) {
        setPoints(prevPoints => prevPoints + 15) // Functional update
        return { ...t, completed: true }
      }
      return t
    }))
  }
  
  // Other functions remain the same
  const addHabit = (habitText) => {
    const newHabit = {
      id: Date.now(),
      text: habitText,
      completed: false
    }
    setHabits([...habits, newHabit])
  }

  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false
    }
    setTasks([...tasks, newTask])
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }


  return (
    <AppContext.Provider value={{
      points,
      level,
      completedChallenges,
      habits,
      tasks,
      // NEW/UPDATED context values for Rewards.jsx progress bar
      currentProgress,
      pointsNeededForLevelUp,
      progressPercentage,
      completeChallenge,
      addHabit,
      toggleHabit,
      addTask,
      toggleTask,
      deleteTask
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
