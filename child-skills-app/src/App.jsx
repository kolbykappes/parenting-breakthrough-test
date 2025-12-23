import { useState, useEffect } from 'react'
import skillsData from './source-categories.json'
import config from './config.json'
import './App.css'

function App() {
  const ages = Object.keys(skillsData.skills_by_age).sort((a, b) => parseInt(a) - parseInt(b))
  const people = config.people

  // State management
  const [currentAgeIndex, setCurrentAgeIndex] = useState(0)
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [showAgeIntro, setShowAgeIntro] = useState(true)
  const [auditData, setAuditData] = useState({})
  const [showSummary, setShowSummary] = useState(false)
  const [showFinalSummary, setShowFinalSummary] = useState(false)

  const currentAge = ages[currentAgeIndex]
  const currentSkills = skillsData.skills_by_age[currentAge]
  const currentSkill = currentSkills[currentSkillIndex]

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('skillsAuditProgress')
    if (saved) {
      const data = JSON.parse(saved)
      setAuditData(data.auditData || {})
      setCurrentAgeIndex(data.currentAgeIndex || 0)
      setCurrentSkillIndex(data.currentSkillIndex || 0)
      setShowAgeIntro(data.showAgeIntro !== undefined ? data.showAgeIntro : true)
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    const progress = {
      auditData,
      currentAgeIndex,
      currentSkillIndex,
      showAgeIntro
    }
    localStorage.setItem('skillsAuditProgress', JSON.stringify(progress))
  }, [auditData, currentAgeIndex, currentSkillIndex, showAgeIntro])

  const recordResponse = (respondents) => {
    const ageKey = currentAge
    const skillName = currentSkill.skill

    setAuditData(prev => ({
      ...prev,
      [ageKey]: {
        ...prev[ageKey],
        [skillName]: respondents
      }
    }))

    // Move to next skill or show summary
    if (currentSkillIndex < currentSkills.length - 1) {
      setCurrentSkillIndex(currentSkillIndex + 1)
    } else {
      // End of chapter - show summary
      setShowSummary(true)
    }
  }

  const handleAllCanDo = () => {
    recordResponse([...people])
  }

  const handleIndividualResponse = (person) => {
    const ageKey = currentAge
    const skillName = currentSkill.skill
    const current = auditData[ageKey]?.[skillName] || []

    if (current.includes(person)) {
      // Remove person
      const updated = current.filter(p => p !== person)
      recordResponse(updated)
    } else {
      // Add person
      recordResponse([...current, person])
    }
  }

  const skipToAge = (ageIndex) => {
    setCurrentAgeIndex(ageIndex)
    setCurrentSkillIndex(0)
    setShowAgeIntro(true)
    setShowSummary(false)
    setShowFinalSummary(false)
  }

  const continueFromSummary = () => {
    if (currentAgeIndex < ages.length - 1) {
      setCurrentAgeIndex(currentAgeIndex + 1)
      setCurrentSkillIndex(0)
      setShowAgeIntro(true)
      setShowSummary(false)
    } else {
      // Last chapter - show final summary
      setShowFinalSummary(true)
      setShowSummary(false)
    }
  }

  const resetAudit = () => {
    setAuditData({})
    setCurrentAgeIndex(0)
    setCurrentSkillIndex(0)
    setShowAgeIntro(true)
    setShowSummary(false)
    setShowFinalSummary(false)
    localStorage.removeItem('skillsAuditProgress')
  }

  // Get progress for current chapter
  const getChapterProgress = () => {
    return `${currentSkillIndex + 1}/${currentSkills.length}`
  }

  // Calculate statistics
  const calculateStats = () => {
    let totalSkills = 0
    let completedSkills = 0
    let skillsByPerson = {}

    people.forEach(person => {
      skillsByPerson[person] = 0
    })

    ages.forEach(age => {
      const skills = skillsData.skills_by_age[age]
      totalSkills += skills.length

      skills.forEach(skill => {
        const responses = auditData[age]?.[skill.skill] || []
        if (responses.length > 0) {
          completedSkills++
        }
        responses.forEach(person => {
          skillsByPerson[person]++
        })
      })
    })

    return { totalSkills, completedSkills, skillsByPerson }
  }

  const calculateChapterStats = () => {
    const ageKey = currentAge
    let total = currentSkills.length
    let completed = 0
    let skillsByPerson = {}

    people.forEach(person => {
      skillsByPerson[person] = 0
    })

    currentSkills.forEach(skill => {
      const responses = auditData[ageKey]?.[skill.skill] || []
      if (responses.length > 0) {
        completed++
      }
      responses.forEach(person => {
        skillsByPerson[person]++
      })
    })

    return { total, completed, skillsByPerson }
  }

  // Render age intro card
  if (showAgeIntro && !showSummary && !showFinalSummary) {
    return (
      <div className="app">
        <div className="container">
          <div className="age-intro-card">
            <h1>Age {currentAge}</h1>
            <p className="skill-count">{currentSkills.length} skills to review</p>
            <button className="btn-primary" onClick={() => setShowAgeIntro(false)}>
              Start Chapter
            </button>
            <div className="age-navigation">
              <h3>Jump to Age:</h3>
              <div className="age-buttons">
                {ages.map((age, index) => (
                  <button
                    key={age}
                    className={`age-btn ${index === currentAgeIndex ? 'active' : ''}`}
                    onClick={() => skipToAge(index)}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-reset" onClick={resetAudit}>
              Reset All Progress
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render chapter summary
  if (showSummary && !showFinalSummary) {
    const stats = calculateChapterStats()
    return (
      <div className="app">
        <div className="container">
          <div className="summary-card">
            <h1>Age {currentAge} - Complete!</h1>
            <div className="summary-stats">
              <p className="stat-large">
                {stats.completed}/{stats.total} skills reviewed
              </p>
              <h3>Skills by Person:</h3>
              <div className="person-stats">
                {people.map(person => (
                  <div key={person} className="person-stat">
                    <span className="person-name">{person}:</span>
                    <span className="person-count">{stats.skillsByPerson[person]} skills</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-primary" onClick={continueFromSummary}>
              {currentAgeIndex < ages.length - 1 ? 'Next Chapter' : 'View Final Summary'}
            </button>
            <div className="age-navigation">
              <h3>Jump to Age:</h3>
              <div className="age-buttons">
                {ages.map((age, index) => (
                  <button
                    key={age}
                    className={`age-btn ${index === currentAgeIndex ? 'active' : ''}`}
                    onClick={() => skipToAge(index)}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render final summary
  if (showFinalSummary) {
    const stats = calculateStats()
    return (
      <div className="app">
        <div className="container">
          <div className="summary-card">
            <h1>Audit Complete!</h1>
            <div className="summary-stats">
              <p className="stat-large">
                {stats.completedSkills}/{stats.totalSkills} total skills reviewed
              </p>
              <h3>Total Skills by Person:</h3>
              <div className="person-stats">
                {people.map(person => (
                  <div key={person} className="person-stat">
                    <span className="person-name">{person}:</span>
                    <span className="person-count">{stats.skillsByPerson[person]} skills</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-primary" onClick={resetAudit}>
              Start New Audit
            </button>
            <div className="age-navigation">
              <h3>Review a Chapter:</h3>
              <div className="age-buttons">
                {ages.map((age, index) => (
                  <button
                    key={age}
                    className="age-btn"
                    onClick={() => skipToAge(index)}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Get current responses
  const currentResponses = auditData[currentAge]?.[currentSkill.skill] || []

  // Render skill question
  return (
    <div className="app">
      <div className="container">
        <div className="progress-header">
          <span className="progress-text">
            Age {currentAge} - {getChapterProgress()}
          </span>
          <button className="btn-menu" onClick={() => setShowAgeIntro(true)}>
            Menu
          </button>
        </div>

        <div className="skill-card">
          <h2 className="skill-title">{currentSkill.skill}</h2>
          <p className="skill-description">{currentSkill.description}</p>

          <div className="response-section">
            <button className="btn-all" onClick={handleAllCanDo}>
              ✓ All of us can do this!
            </button>

            <div className="divider">or select individuals:</div>

            <div className="individual-buttons">
              {people.map(person => (
                <button
                  key={person}
                  className={`btn-person ${currentResponses.includes(person) ? 'selected' : ''}`}
                  onClick={() => handleIndividualResponse(person)}
                >
                  {person}
                </button>
              ))}
            </div>

            {currentResponses.length > 0 && (
              <button className="btn-next" onClick={() => recordResponse(currentResponses)}>
                Next Skill →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
