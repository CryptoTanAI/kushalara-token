import React, { useState, useEffect } from 'react'

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // Set target date to September 24th, 2025
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

  return (
    <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
      <h3 className="text-2xl font-bold text-center mb-6 gradient-text">
        Token Launch Countdown
      </h3>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-400">{timeLeft.days}</div>
          <div className="text-sm text-gray-400">Days</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-400">{timeLeft.hours}</div>
          <div className="text-sm text-gray-400">Hours</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-400">{timeLeft.minutes}</div>
          <div className="text-sm text-gray-400">Minutes</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-400">{timeLeft.seconds}</div>
          <div className="text-sm text-gray-400">Seconds</div>
        </div>
      </div>
      <p className="text-center text-gray-300 mt-4">
        Until KushAlara Token Launch - September 24th, 2025
      </p>
    </div>
  )
}

export default CountdownTimer

