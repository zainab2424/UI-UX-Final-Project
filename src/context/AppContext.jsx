import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

const LEVEL_POINTS_REQUIREMENT = 100

export function AppProvider({ children }) {

  // Helper to load from sessionStorage
  const load = (key, fallback) => {
    const stored = sessionStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  }

  // --- STORED STATES ---
  const [points, setPoints] = useState(() => load("points", 0))
  const [level, setLevel] = useState(() => load("level", 1))
  const [completedChallenges, setCompletedChallenges] = useState(() =>
    load("completedChallenges", [])
  )

  const [habits, setHabits] = useState(() =>
    load("habits", [
      { id: 1, text: "Study 2 hours after breakfast daily", completed: false },
      { id: 2, text: "Update calendar before bed", completed: false }
    ])
  )

  const [tasks, setTasks] = useState(() =>
    load("tasks", [
      { id: 1, text: "Complete Assignment 1", completed: false },
      { id: 2, text: "Complete Quiz 2", completed: false },
      { id: 3, text: "Complete UX Project", completed: false }
    ])
  )

  // --- SYNCHRONIZE TO SESSION STORAGE ---
  useEffect(() => sessionStorage.setItem("points", JSON.stringify(points)), [points])
  useEffect(() => sessionStorage.setItem("level", JSON.stringify(level)), [level])
  useEffect(() => sessionStorage.setItem("habits", JSON.stringify(habits)), [habits])
  useEffect(() => sessionStorage.setItem("tasks", JSON.stringify(tasks)), [tasks])
  useEffect(() => sessionStorage.setItem("completedChallenges", JSON.stringify(completedChallenges)), [completedChallenges])

  // --- LEVEL SYSTEM ---
  useEffect(() => {
    const expectedLevel = Math.floor(points / LEVEL_POINTS_REQUIREMENT) + 1
    if (expectedLevel !== level) setLevel(expectedLevel)
  }, [points, level])

  // --- PROGRESS VALUES (Required by Rewards.jsx) ---
  const pointsForCurrentLevelStart = (level - 1) * LEVEL_POINTS_REQUIREMENT
  const currentProgress = Math.max(0, points - pointsForCurrentLevelStart)
  const pointsNeededForLevelUp = LEVEL_POINTS_REQUIREMENT
  const progressPercentage = Math.min((currentProgress / pointsNeededForLevelUp) * 100, 100)

  // --- BADGE SYSTEM ---
  const badge = (() => {
    if (level <= 1) return "🐣"
    if (level <= 2) return "📚"
    if (level <= 3) return "🌟"
    if (level <= 4) return "🏆"
    if (level <= 5) return "👑"
    return "💕"
  })()

  // --- CHALLENGES ---
  const completeChallenge = (id, awardedPoints) => {
    if (!completedChallenges.includes(id)) {
      setCompletedChallenges(prev => [...prev, id])
      setPoints(p => p + awardedPoints)
      return true
    }
    return false
  }

  // --- HABITS ---
  const addHabit = text => {
    setHabits(prev => [...prev, { id: Date.now(), text, completed: false }])
  }

  const toggleHabit = id => {
    setHabits(prev =>
      prev.map(h => h.id === id && !h.completed ? { ...h, completed: true } : h)
    )
    setPoints(p => p + 10)
  }

  // --- TASKS ---
  const addTask = text => {
    setTasks(prev => [...prev, { id: Date.now(), text, completed: false }])
  }

  const toggleTask = id => {
    setTasks(prev =>
      prev.map(t => t.id === id && !t.completed ? { ...t, completed: true } : t)
    )
    setPoints(p => p + 15)
  }

  const deleteTask = id => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <AppContext.Provider value={{
      points,
      level,
      badge,
      habits,
      tasks,
      completedChallenges,

      // Rewards page values
      currentProgress,
      pointsNeededForLevelUp,
      progressPercentage,

      // Functions
      completeChallenge,
      addHabit,
      toggleHabit,
      addTask,
      toggleTask,
      deleteTask,
      setHabits,
      setTasks
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}


