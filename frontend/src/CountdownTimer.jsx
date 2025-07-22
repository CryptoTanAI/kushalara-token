import React, { useState, useEffect } from 'react'

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const targetDate = new Date('2025-09-24T00:00:00Z').getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const TimeUnit = ({ value, label }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 card-hover text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 pulse">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-gray-400 text-sm uppercase tracking-wider">
        {label}
      </div>
    </div>
  )

  return (
    <div className="text-center mb-16 fade-in">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
        Token Launch Countdown
      </h2>
      <p className="text-gray-300 mb-8 text-lg">
        Until KushAlara Token Launch - September 24th, 2025
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-yellow-400/20 via-blue-400/20 to-purple-400/20 rounded-2xl border border-gray-700 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-2 gradient-text">
          🚀 Get Ready for Launch!
        </h3>
        <p className="text-gray-300 text-sm">
          Join the revolution in digital governance. Be among the first to own KushAlara tokens and shape the future of Web3 sovereignty.
        </p>
      </div>
    </div>
  )
}

export default CountdownTimer
