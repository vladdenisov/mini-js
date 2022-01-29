/* eslint-disable prefer-let/prefer-let */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable camelcase */

// Simple State management
const useState = (defaultValue, name = 'default') => {
  const state = JSON.parse(localStorage.getItem(name)) || defaultValue || {}
  const subscribers = []
  state.subscribe = callback => subscribers.push(callback)
  const setState = value => {
    state.value = value
    // Save state to LocalStorage
    localStorage.setItem(name, JSON.stringify(state))
    // Run 'onchange' callbacks
    subscribers.forEach(e => e(state))
  }
  // Return current state and state setter
  return [state, setState]
}

const [units, setUnits] = useState({ value: 'c' }, 'units')
const [time, setTime] = useState({ value: false }, 'time')

const checkTheme = date => {
  let h = parseInt(date.getHours())
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
  let h = date.getHours()
  let m = date.getMinutes()
  let s = date.getSeconds()
  setTimeout(
    () => setDate(date),
    (24 * 60 * 60 - h * 60 * 60 - m * 60 - s) * 1000
  )
}

const getWeather = async () => {
  let lat_long = await fetch('https://ipinfo.io/?token=3f3bf137e9180f')
    .then(res => res.json())
    .then(res => res.loc)
  if (!lat_long) return
  let data = await fetch(
    'https://api.weatherapi.com/v1/current.json?key=7be83a3788e645f481e202959202409&q=' +
      lat_long
  ).then(res => res.json())
  if (!data) return
  setWeather(data)
  units.subscribe(() => setWeather(data))
}

const setWeather = data => {
  let weather_span = document.getElementById('weather')
  weather_span.innerText = `${data.current.condition.text}, ${
    data.current['temp_' + units.value]
  }°${units.value.toUpperCase()}, Feels like ${
    data.current['feelslike_' + units.value]
  }°${units.value.toUpperCase()}`
}

const setTimeToClock = (date, span) => {
  span.innerText = date.toLocaleTimeString('default', {
    hour12: !time.value
  })
  document.title = span.innerText
}

document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '').split('-')
  console.log(hash)
  if (hash.includes('notion')) {
    document.getElementsByTagName('body')[0].classList.add('notion')
    document.getElementById('controls').style = 'display: none'
    if (hash.includes('dark')) {
      document.getElementsByTagName('body')[0].classList.add('night')
    }
    if (hash.includes('c')) {
      setUnits('c')
    } else {
      setUnits('f')
    }
    if (hash.includes('24')) {
      setTime(true)
    } else {
      setTime(false)
    }
  }
  document.getElementById('units').addEventListener('change', e => {
    setUnits(`${e.target.checked ? 'f' : 'c'}`)
  })
  document.getElementById('units').checked = units.value === 'f'

  document.getElementById('time').addEventListener('change', e => {
    setTime(e.target.checked)
  })
  document.getElementById('time').checked = time.value

  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)

  let clock_span = document.getElementById('clock')
  let date = new Date()
  if (!window.location.hash.includes('notion-dark')) {
    checkTheme(date)
  }

  setTimeout(() => {
    date = new Date()
    setTimeToClock(date, clock_span)
    if (!window.location.hash.includes('notion-dark')) {
      setInterval(() => {
        date = new Date()
        checkTheme(date)
        setTimeToClock(date, clock_span)
      }, 1000)
    } else {
      setInterval(() => {
        date = new Date()
        setTimeToClock(date, clock_span)
      }, 1000)
    }
    setDate(date)
    getWeather()
  }, 1000 - Math.floor(date.getMilliseconds()))
})

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
})
