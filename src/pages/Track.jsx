import { useState, useEffect, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Track() {
  
  const { habits, tasks, addHabit, toggleHabit, addTask, toggleTask, deleteTask, setHabits, setTasks } = useApp()
  
  // --- STATE FOR INPUTS/BASIC TRACKING ---
  const [newHabit, setNewHabit] = useState('')
  const [newTask, setNewTask] = useState('')
  const [selectedMood, setSelectedMood] = useState(null)
  
  // --- 1. MOOD TRACKER: Confirmation State (FIXED: Added label and timestamp for reliability) ---
  const [moodConfirmation, setMoodConfirmation] = useState({ isOpen: false, emoji: '', label: '', timestamp: 0 });

  // --- 2. NOTE TAKER: State for notes management ---
  const [notes, setNotes] = useState(() => {
    return [{ id: 1, title: 'First Note', content: 'Welcome to your notes! Click "New Note" to start another one.' }];
  });
  const [currentNoteId, setCurrentNoteId] = useState(1);
  const currentNote = useMemo(() => notes.find(n => n.id === currentNoteId) || notes[0], [notes, currentNoteId]);

  // --- 3. HABIT TRACKER: State for Undo Delete (REMOVED per request) ---
  // const [lastDeletedHabit, setLastDeletedHabit] = useState(null); // REMOVED

  // --- 4. POMODORO TIMER: State for configuration and time tracking ---
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [timerMinutes, setTimerMinutes] = useState(workDuration);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // NEW: State for the Pomodoro end-of-period pop-up
  const [timerPopup, setTimerPopup] = useState({ isOpen: false, title: '', message: '' });

  // Sync initial timer display with workDuration setting
  useEffect(() => {
    setTimerMinutes(workDuration);
  }, [workDuration]);

  // --- CONSTANTS ---
  const DARK_PURPLE = '#7940C8';

  // --- POMODORO TIMER LOGIC (MODIFIED ALERT TO POPUP) ---
  useEffect(() => {
    let interval = null;

    // Function to show the custom popup
    const showTimerPopup = (title, message) => {
      setTimerPopup({ isOpen: true, title, message });
      // Hide popup after 3 seconds
      setTimeout(() => setTimerPopup({ isOpen: false, title: '', message: '' }), 3000); 
    }

    // Reset timer to current interval length
    const resetTimer = (isWork) => {
      setIsWorkTime(isWork);
      setTimerMinutes(isWork ? workDuration : breakDuration);
      setTimerSeconds(0);
    };

    if (isRunning) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          // Timer reached 0, switch phase
          if (isWorkTime) {
            showTimerPopup('Work Finished!', 'Time for a break. Go get some coffee!');
            resetTimer(false); // Switch to break
          } else {
            showTimerPopup('Break Finished!', 'Time to get back to work. You got this!');
            resetTimer(true); // Switch back to work
          }
        }
      }, 1000);
    } else if (!isRunning && (timerMinutes !== (isWorkTime ? workDuration : breakDuration) || timerSeconds !== 0)) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timerMinutes, timerSeconds, isWorkTime, workDuration, breakDuration]);

  // --- HANDLERS FOR TRACKING SECTIONS ---

  // Habit Tracker: Simple add (Delete/Undo removed)
  const handleAddHabit = () => {
    if (newHabit.trim()) {
      addHabit(newHabit);
      setNewHabit('');
    }
  }

  // FIX: To Do List - Guarantees task toggling and view update.
  const handleToggleTask = (id) => {
    // 1. Call the context function to update the global state (for data persistence/sync)
    toggleTask(id); 

    // 2. Update the local component's task state immediately to ensure the visual check/uncheck works instantly.
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask);
      setNewTask('');
    }
  }

  // Mood Tracker: Handlers
  const moods = [
    { emoji: '😓', label: 'Very Bad' },
    { emoji: '🙁', label: 'Bad' },
    { emoji: '😐', label: 'Okay' },
    { emoji: '😊', label: 'Good' },
    { emoji: '🤩', 'label': 'Very Good' }
  ]

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.label);
    // Use new state structure
    setMoodConfirmation({ 
        isOpen: true, 
        emoji: mood.emoji, 
        label: mood.label, // Added label
        timestamp: Date.now() 
    });
    // Hide confirmation after a short delay
    setTimeout(() => setMoodConfirmation({ isOpen: false, emoji: '', label: '', timestamp: 0 }), 2000); 
  };
  
  // Note Taker: Logic for adding, selecting, and updating notes (UNMODIFIED)
  const handleAddNote = () => {
    const newId = Math.max(...notes.map(n => n.id), 0) + 1;
    const newNote = { id: newId, title: `Note ${newId}`, content: '' };
    setNotes([...notes, newNote]);
    setCurrentNoteId(newId);
  };

  const handleSelectNote = (id) => {
    setCurrentNoteId(id);
  };
  
  const handleUpdateNote = (newContent) => {
    setNotes(notes.map(n => 
      n.id === currentNoteId ? { ...n, content: newContent } : n
    ));
  };
  
  const handleDeleteNote = (id) => {
      if (notes.length > 1) {
          setNotes(notes.filter(n => n.id !== id));
          if (currentNoteId === id) {
              // Select the next available note or the first one
              setCurrentNoteId(notes.filter(n => n.id !== id)[0].id);
          }
      }
  };
  
  return (
    <div className="min-h-screen w-full bg-[#F8EDF7] relative">
      <Navbar />

      {/* Main content container */}
      <main className="max-w-[1440px] mx-auto px-10 py-8 space-y-6">
        
        {/* Hero Section */}
        <section className="pt-8 pb-4">
          <h1 
            className="font-jomhuria font-normal text-[110px] leading-[110px] tracking-[0.03em] text-[#C9A9FF]"
            style={{
              textShadow: `-2px -2px 0 ${DARK_PURPLE}, 2px -2px 0 ${DARK_PURPLE}, -2px 2px 0 ${DARK_PURPLE}, 2px 2px 0 ${DARK_PURPLE}, 0px 4px 4px rgba(0,0,0,0.25)`
            }}
          >
            Track Your Journey!
          </h1>
          {/* HEADING COLOR FIX: Reverted color back to Dark Purple */}
          <p className="font-jomhuria font-normal text-[50px] leading-[50px] text-[#7940C8] ml-4 mt-2">
            Habits, Tasks, Moods and more!
          </p>
        </section>

        {/* To Do List (Tasks) */}
        {/* OUTLINE FIX: Restored border-[3px] border-[#7940C8] */}
        <section className="bg-[#C9A9FF] border-[3px] border-[#7940C8] rounded-[16px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-6 space-y-3">
          {/* HEADING COLOR FIX: Reverted color back to Dark Purple */}
          <h2 className="font-jomhuria text-[45px] leading-[45px] text-[#7940C8]">To Do List:</h2>
          
          {/* Input Row */}
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Enter Input"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              className="flex-1 h-[50px] bg-[#F8EDF7] border-2 border-[#7940C8] rounded-[10px] p-[10px] font-jomhuria text-[35px] leading-[35px] text-[#FF8AD8] placeholder:text-[#FF8AD8] box-border min-w-0"
            />
            <button
              onClick={handleAddTask}
              className="w-[50px] h-[50px] bg-[#FFE981] border-2 border-[#7940C8] rounded-[10px] flex justify-center items-center font-jomhuria text-[40px] leading-[40px] text-[#7940C8] hover:opacity-90 transition-opacity"
            >
              +
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-3 pt-1">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 bg-[#F8EDF7] rounded-[10px] p-2 pr-3 min-h-[48px]">
                {/* Checkbox/Toggle Button: USES handleToggleTask for guaranteed unchecking */}
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className={`w-[48px] h-[48px] border-2 border-[#7940C8] rounded-[15px] flex items-center justify-center font-jomhuria text-[40px] leading-[40px] text-black ${task.completed ? 'bg-[#7EC8F5]' : 'bg-[#FFE981]'}`}
                >
                  {task.completed ? '✓' : ' '}
                </button>
                
                {/* Task Text */}
                <span className={`flex-1 font-jomhuria text-[35px] leading-[40px] text-[#7940C8] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${task.completed ? 'line-through opacity-70' : ''} min-w-0 break-words`}>
                  {task.text}
                </span>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="w-[70px] h-[40px] bg-[#FF8AD8] border-2 border-[#7940C8] rounded-[10px] flex justify-center items-center font-jomhuria text-[35px] leading-[35px] text-[#F8EDF7] hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            ))}
            
          </div>
        </section>

        {/* Habit Tracker: REMOVED Undo/Delete features */}
        {/* OUTLINE FIX: Restored border-[3px] border-[#7940C8] */}
        <section className="bg-[#7EC8F5] border-[3px] border-[#7940C8] rounded-[16px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-6 space-y-3">
          {/* HEADING COLOR FIX: Reverted color back to Light Pink */}
          <h2 className="font-jomhuria text-[45px] leading-[45px] text-[#F8EDF7]">Habit Tracker:</h2>
          
          {/* Input Row */}
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Enter Input"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
              className="flex-1 h-[50px] bg-[#F8EDF7] border-2 border-[#7940C8] rounded-[10px] p-[10px] font-jomhuria text-[35px] leading-[35px] text-[#FF8AD8] placeholder:text-[#FF8AD8] box-border min-w-0"
            />
            <button
              onClick={handleAddHabit}
              className="w-[50px] h-[50px] bg-[#FFE981] border-2 border-[#7940C8] rounded-[10px] flex justify-center items-center font-jomhuria text-[40px] leading-[40px] text-[#7940C8] hover:opacity-90 transition-opacity"
            >
              +
            </button>
          </div>
          
          {/* Habit List - Only Done button remains */}
          <div className="space-y-3 pt-1">
            {habits.map(habit => (
              <div key={habit.id} className={`w-full h-[60px] bg-[#FFE981] border-2 border-[#6734AE] rounded-[10px] flex justify-between items-center p-3 pr-5 box-border ${habit.completed ? 'opacity-70' : ''}`}>
                
                {/* Habit Text */}
                <span className={`font-jomhuria font-normal text-[40px] leading-[40px] text-[#6734AE] min-w-0 break-words ${habit.completed ? 'line-through' : ''}`}>
                  {habit.text}
                </span>

                {/* Action Buttons: Only Done button remains */}
                <div className="flex gap-2">
                    {/* Done Button */}
                    {!habit.completed && (
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className="w-[80px] h-[40px] bg-[#FF8AD8] border-2 border-[#6734AE] rounded-[10px] flex justify-center items-center font-jomhuria text-[35px] leading-[35px] text-[#F8EDF7] hover:opacity-90 transition-opacity"
                      >
                        Done
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mood Tracker & Pomodoro Timer Row (using Grid for two columns) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Mood Tracker: UPDATED Confirmation Logic and UI */}
          <div className="bg-[#FF8AD8] border-[3px] border-[#7940C8] rounded-[16px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-6 space-y-3 relative overflow-hidden">
            <h2 className="font-jomhuria text-[45px] leading-[45px] text-[#F8EDF7]">Track My Mood:</h2>
            
            {/* Mood Buttons */}
            <div className="flex justify-between gap-4 mt-3">
              {moods.map((mood, index) => (
                <button
                  key={index}
                  onClick={() => handleMoodSelect(mood)}
                  className={`w-20 h-20 bg-[#FFE981] border-2 border-[#7940C8] rounded-[14px]
                    overflow-hidden flex flex-col items-center justify-center 
                    py-2
                    transition-transform duration-200 
                    ${selectedMood === mood.label ? `scale-110 shadow-[0_0_15px_${DARK_PURPLE}]` : 'hover:scale-105'}`}
                >
                  <span className="text-[32px] leading-none">
                    {mood.emoji}
                  </span>

                  <span className="font-jomhuria text-[18px] leading-none text-[#7940C8]">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>

             {/* Styled Confirmation Message Overlay (UPDATED to cover full container and match style) */}
            {moodConfirmation.isOpen && (
              <div 
                key={moodConfirmation.timestamp}
                className="absolute inset-0 bg-[#F8EDF7] rounded-[16px] flex flex-col justify-center items-center animate-fadeInOut"
                style={{ zIndex: 10 }}
              >
                  <span className={`font-jomhuria text-[100px] leading-[100px] text-[${DARK_PURPLE}]`}>
                      {moodConfirmation.emoji}
                  </span>
                  <span className={`font-jomhuria text-[50px] leading-[50px] text-[${DARK_PURPLE}] mt-2`}>
                      Mood Logged!
                  </span>
                  <span className={`font-jomhuria text-[35px] leading-[35px] text-[#FF8AD8]`}>
                      ({moodConfirmation.label})
                  </span>
              </div>
            )}
            
            <style jsx global>{`
              @keyframes fadeInOut {
                0% { opacity: 0; transform: scale(0.9); }
                20% { opacity: 1; transform: scale(1); }
                80% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0.9); }
              }
              .animate-fadeInOut {
                animation: fadeInOut 2s ease-in-out forwards;
              }
            `}</style>
          </div>

          {/* Pomodoro Timer: Timer text color changed & Pop-up added */}
          {/* OUTLINE FIX: Restored border-[3px] border-[#7940C8] */}
          <div className="bg-[#FFE981] border-[3px] border-[#7940C8] rounded-[16px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-6 space-y-3 relative overflow-hidden">
            <h2 className="font-jomhuria text-[45px] leading-[45px] text-[#7940C8]">Pomodoro Timer:</h2>
            
            <div className="flex justify-between items-center gap-3">
              {/* Timer Display (Color changed to DARK_PURPLE) */}
              <div className="flex flex-col items-start">
                  <p className={`font-jomhuria font-normal text-[70px] leading-[70px] text-[${DARK_PURPLE}] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-1`}>
                    {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                  </p>
                  <span className="font-jomhuria text-[35px] leading-[35px] text-[#7940C8] ml-2 -mt-2">
                      {isWorkTime ? 'Work Time' : 'Break Time'}
                  </span>
              </div>


              {/* Start/Reset Buttons column */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="w-[120px] h-[45px] bg-[#FF8AD8] border-2 border-[#6734AE] rounded-[10px] flex justify-center items-center font-jomhuria text-[35px] leading-[35px] text-[#F8EDF7] hover:opacity-90 transition-opacity"
                >
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => { 
                    setIsRunning(false); 
                    setIsWorkTime(true); // Reset to work time
                    setTimerMinutes(workDuration); 
                    setTimerSeconds(0); 
                  }}
                  className="w-[120px] h-[45px] bg-[#7EC8F5] border-2 border-[#6734AE] rounded-[10px] flex justify-center items-center font-jomhuria text-[35px] leading-[35px] text-[#F8EDF7] hover:opacity-90 transition-opacity"
                >
                  Reset
                </button>
              </div>
            </div>
            
            {/* Configuration Inputs */}
            <div className="pt-2 border-t-2 border-[#7940C8]">
                <div className="flex justify-between gap-3 mb-2">
                    <label className="font-jomhuria text-[35px] leading-[35px] text-[#7940C8]">Work (mins):</label>
                    <input
                        type="number"
                        min="1"
                        value={workDuration}
                        onChange={(e) => setWorkDuration(Number(e.target.value))}
                        className="w-16 h-10 bg-[#F8EDF7] border-2 border-[#7940C8] rounded-[5px] p-1 text-[30px] font-jomhuria text-[#FF8AD8]"
                        disabled={isRunning}
                    />
                </div>
                <div className="flex justify-between gap-3">
                    <label className="font-jomhuria text-[35px] leading-[35px] text-[#7940C8]">Break (mins):</label>
                    <input
                        type="number"
                        min="1"
                        value={breakDuration}
                        onChange={(e) => setBreakDuration(Number(e.target.value))}
                        className="w-16 h-10 bg-[#F8EDF7] border-2 border-[#7940C8] rounded-[5px] p-1 text-[30px] font-jomhuria text-[#FF8AD8]"
                        disabled={isRunning}
                    />
                </div>
            </div>

            {/* NEW: Styled Pomodoro Timer Pop-up */}
            {timerPopup.isOpen && (
              <div 
                className="absolute inset-0 bg-[#F8EDF7] rounded-[16px] flex flex-col justify-center items-center animate-fadeInOut"
                style={{ zIndex: 10 }}
              >
                  <span className={`font-jomhuria text-[70px] leading-[70px] text-[${DARK_PURPLE}]`}>
                      🔔
                  </span>
                  <span className={`font-jomhuria text-[50px] leading-[50px] text-[#FF8AD8] mt-2`}>
                      {timerPopup.title}
                  </span>
                  <span className={`font-jomhuria text-[35px] leading-[35px] text-[${DARK_PURPLE}]`}>
                      {timerPopup.message}
                  </span>
              </div>
            )}
          </div>
        </section>

        {/* Note Taker: Text and Outline Color fixed */}
        {/* OUTLINE FIX: Restored border-[3px] border-[#7940C8] */}
        <section className="bg-[#C9A9FF] border-[3px] border-[#7940C8] rounded-[16px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-6 space-y-3">
          <h2 className="font-jomhuria text-[45px] leading-[45px] text-[#6734AE]">Note Taker:</h2>

          <div className="flex gap-3 min-h-[250px]">
            {/* Note Controls Column - Note List, Outline fixed */}
            <div className="flex flex-col gap-3 w-40">
              {/* New Note Button */}
              <button 
                onClick={handleAddNote}
                className="w-full h-[70px] bg-[#FFE981] border-2 border-[#6734AE] rounded-[10px] flex items-center justify-between p-2 px-3 hover:bg-white transition-colors"
              >
                <span className="font-jomhuria text-[35px] leading-[35px] text-[#6734AE]">New Note</span>
                <span className="font-jomhuria text-[35px] leading-[35px] text-[#6734AE] w-9 h-9 bg-[#FF8AD8] border-2 border-[#6734AE] rounded-[10px] flex justify-center items-center">+</span>
              </button>
              
              {/* Note List - Fixed focus ring color */}
              {notes.map((note) => (
                <div key={note.id} className="flex gap-1 items-center">
                    <button 
                      onClick={() => handleSelectNote(note.id)}
                      // Fixed focus ring color to DARK_PURPLE
                      className={`flex-1 h-[70px] border-2 border-[#6734AE] rounded-[10px] flex items-center p-2 px-3 truncate focus:outline-none focus:ring-4 focus:ring-[#7940C8] focus:ring-opacity-50 ${note.id === currentNoteId ? 'bg-[#FF8AD8] text-white' : 'bg-[#F8EDF7] text-[#6734AE] hover:bg-gray-100'}`}
                    >
                      <span className="font-jomhuria text-[35px] leading-[35px]">{note.title}</span>
                    </button>
                    {notes.length > 1 && (
                        <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="w-7 h-7 bg-red-500 border-2 border-red-700 rounded-full flex items-center justify-center text-white font-bold text-xs"
                            title="Delete Note"
                        >
                            x
                        </button>
                    )}
                </div>
              ))}
              
            </div>

            {/* Note Textarea - Fixed text color and focus ring color */}
            <textarea
              key={currentNoteId}
              placeholder="Start typing your notes here..."
              value={currentNote ? currentNote.content : ''}
              onChange={(e) => handleUpdateNote(e.target.value)}
              // Fixed text color to DARK_PURPLE and focus ring color
              className={`flex-1 min-h-[250px] bg-[#F8EDF7] border-3 border-[#6734AE] rounded-[10px] p-3 font-jomhuria text-[35px] leading-[35px] text-[#7940C8] box-border resize-none focus:outline-none focus:ring-4 focus:ring-[#7940C8] focus:ring-opacity-50`}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Track
