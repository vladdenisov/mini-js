/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable camelcase */
const useState = (create = {}) => {
  let state = create
  state.subscribe = callback => subscribers.push(callback)
  let subscribers = []
  let setState = new_state => {
    state = new_state
    state.subscribe = callback => subscribers.push(callback)
    subscribers.forEach(e => e(state))
  }
  return [state, setState]
}

let [units, setUnits] = useState({ value: 'c' })
let [time, setTime] = useState({ value: false })

time.subscribe(state => (time = state))

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
  let weather_span = document.getElementById('weather')
  units.subscribe(s => {
    weather_span.innerText = `${data.current.condition.text}, ${
      data.current['temp_' + s.value]
    }°${s.value.toUpperCase()}, Feels like ${
      data.current['feelslike_' + s.value]
    }°${s.value.toUpperCase()}`
  })
  weather_span.innerText = `${data.current.condition.text}, ${data.current.temp_c}°C, Feels like ${data.current.feelslike_c}°C`
}

document.getElementById('units').addEventListener('change', e => {
  setUnits({ value: `${e.target.checked ? 'f' : 'c'}` })
})
document.getElementById('time').addEventListener('change', e => {
  setTime({ value: e.target.checked })
})

document.addEventListener('DOMContentLoaded', () => {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
  let clock_span = document.getElementById('clock')
  let date = new Date()
  let h = date.getHours()
  let m = date.getMinutes()
  let s = date.getSeconds()
  checkTheme(date)
  clock_span.innerText = date.toLocaleTimeString('default', {
    hour12: !time.value
  })
  document.title = clock_span.innerText
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
      clock_span.innerText = date.toLocaleTimeString('default', {
        hour12: !time.value
      })
      document.title = clock_span.innerText
    }, 1000)
  }, 1000 - Math.floor(date.getMilliseconds()))
  getWeather()
})

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
})
