/* eslint-disable camelcase */
const checkTheme = date => {
  let h = parseInt(date.getHours())
  console.log(h)
  if (h > 6 && h < 12) {
    if (!document.getElementById('body').classList.contains('morning')) {
      document.getElementById('body').classList = []
      document.getElementById('body').classList.add('morning')
    }
  } else if (h > 20 || h < 7) {
    if (!document.getElementById('body').classList.contains('night')) {
      document.getElementById('body').classList = []
      document.getElementById('body').classList.add('night')
    }
  } else if (h > 16 && h < 21) {
    if (!document.getElementById('body').classList.contains('evening')) {
      document.getElementById('body').classList = []
      document.getElementById('body').classList.add('evening')
    }
  } else if (!document.getElementById('body').classList.contains('day')) {
    document.getElementById('body').classList = []
    document.getElementById('body').classList.add('day')
  }
}
const setDate = date => {
  let date_span = document.getElementById('date')
  date_span.innerText = date.toLocaleDateString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    weekday: 'short'
  })
}
document.addEventListener('DOMContentLoaded', () => {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
  let clock_span = document.getElementById('clock')

  let date = new Date()
  let h = date.getHours()
  let m = date.getMinutes()
  let s = date.getSeconds()
  setDate(date)
  setTimeout(
    () => setDate(date),
    (24 * 60 * 60 - h * 60 * 60 - m * 60 - s) * 1000
  )

  setTimeout(() => {
    setInterval(() => {
      date = new Date()
      h = date.getHours()
      m = date.getMinutes()
      s = date.getSeconds()
      checkTheme(date)
      // clock_span.innerText = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${
      //   s < 10 ? '0' + s : s
      // }`
      clock_span.innerText = date.toLocaleTimeString()
      document.title = clock_span.innerText
    }, 1000)
  }, 1000 - Math.floor(date.getMilliseconds()))
})

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
})
