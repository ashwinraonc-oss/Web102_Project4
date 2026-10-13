const LABELS = {
  year: 'Year',
  month: 'Month',
  hemisphere: 'Hemisphere',
  region: 'Region',
}

function ImageCard({ item, onAttrClick, banList }) {
  return (
    <div className="card">
      <img src={item.imageUrl} alt={`Earth on ${item.date}`} />
      <p className="taken">Taken {item.date} UTC</p>
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
