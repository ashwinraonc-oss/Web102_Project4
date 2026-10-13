function BanList({ banList, onRemove }) {
  return (
    <div className="banlist">
      <h2>Ban List</h2>
      {banList.length === 0 ? (
        <p className="hint">Click an attribute on an image to ban it.</p>
      ) : (
        <div className="attrs">
          {banList.map(value => (
            <button
              key={value}
              className="attr banned"
              onClick={() => onRemove(value)}
              title="Click to remove from ban list"
            >
              {value} ✕
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default BanList
