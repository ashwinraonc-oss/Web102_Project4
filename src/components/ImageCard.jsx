const LABELS = {
  year: 'Year',
  month: 'Month',
  hemisphere: 'Hemisphere',
  region: 'Region',
}

function formatCoord(value, pos, neg) {
  return `${Math.abs(value).toFixed(1)}° ${value >= 0 ? pos : neg}`
}

function ImageCard({ item, onAttrClick, banList }) {
  return (
    <div className="card">
      <img src={item.imageUrl} alt={`Earth on ${item.date}`} />
      <p className="taken">
        <strong>{item.date} UTC</strong>
        <br />
        Centered on {formatCoord(item.centroid_coordinates.lat, 'N', 'S')},{' '}
        {formatCoord(item.centroid_coordinates.lon, 'E', 'W')}
      </p>
      <div className="attrs">
        {Object.entries(item.attrs).map(([key, value]) => (
          <button
            key={key}
            className={`attr ${banList.includes(value) ? 'banned' : ''}`}
            onClick={() => onAttrClick(value)}
            title="Click to ban this value"
          >
            <span className="attr-label">{LABELS[key]}</span>
            {value}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ImageCard
