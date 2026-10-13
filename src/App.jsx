import { useState, useEffect } from 'react'
import ImageCard from './components/ImageCard'
import BanList from './components/BanList'
import './App.css'

const KEY = import.meta.env.VITE_NASA_KEY
const BASE = 'https://api.nasa.gov/EPIC'
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function deriveAttrs(shot) {
  const { lat, lon } = shot.centroid_coordinates
  const [year, month] = shot.date.split(' ')[0].split('-')

  let region = 'Pacific'
  if (lon >= -170 && lon < -30) region = 'Americas'
  else if (lon >= -30 && lon < 60) region = 'Europe & Africa'
  else if (lon >= 60 && lon < 150) region = 'Asia'

  return {
    year,
    month: MONTHS[Number(month) - 1],
    hemisphere: lat >= 0 ? 'Northern' : 'Southern',
    region,
  }
}

function App() {
  const [dates, setDates] = useState([])
  const [item, setItem] = useState(null)
  const [banList, setBanList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${BASE}/api/natural/available?api_key=${KEY}`)
      .then(r => {
        if (!r.ok) throw new Error(`NASA API returned ${r.status}`)
        return r.json()
      })
      .then(setDates)
      .catch(e => setError(e.message))
  }, [])

  async function discover() {
    setLoading(true)
    setError('')
    try {
      for (let i = 0; i < 10; i++) {
        const day = dates[Math.floor(Math.random() * dates.length)]
        const res = await fetch(`${BASE}/api/natural/date/${day}?api_key=${KEY}`)
        if (!res.ok) throw new Error(`NASA API returned ${res.status}`)
        const shots = await res.json()
        if (!Array.isArray(shots) || shots.length === 0) continue

        const shot = shots[Math.floor(Math.random() * shots.length)]
        const attrs = deriveAttrs(shot)
        if (Object.values(attrs).some(v => banList.includes(v))) continue

        const [y, m, d] = day.split('-')
        const imageUrl = `${BASE}/archive/natural/${y}/${m}/${d}/jpg/${shot.image}.jpg?api_key=${KEY}`
        setItem({ ...shot, attrs, day, imageUrl })
        return
      }
      setError('Couldn\'t find an image that avoids your ban list. Try removing a ban.')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function toggleBan(value) {
    setBanList(b => (b.includes(value) ? b.filter(x => x !== value) : [...b, value]))
  }

  return (
    <div className="app">
      <h1>Veni Vici</h1>
      <p className="subtitle">Discover Earth from a million miles away, via NASA's EPIC camera.</p>

      <button
        className="discover"
        onClick={discover}
        disabled={loading || dates.length === 0}
      >
        {loading ? 'Searching...' : 'Discover'}
      </button>

      {error && <p className="error">{error}</p>}
      {item && <ImageCard item={item} onAttrClick={toggleBan} banList={banList} />}
      <BanList banList={banList} onRemove={toggleBan} />
    </div>
  )
}

export default App
