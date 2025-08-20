import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "./App.css";
import posterColors from "./templates"; // template image here
import logo from "./assets/Adhuni Gold logo b.jpg"; // logo image here

function App() {
  const currentDate = new Date();
const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
const displayDate = (date) => {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
};
  const [date, setDate] = useState(formattedDate);
  const [rate1, setRate1] = useState('0');
  const posterRef = useRef(null);

  const [selectedPoster, setSelectedPoster] = useState(posterColors[4]);
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  // Set the initial poster on first load
  if (firstLoad) {
    setFirstLoad(false);
    handlePosterChange(selectedPoster);
  }

  const handlePosterChange = (poster) => {
    if (selectedPoster.name === poster.name) return; // Avoid reloading the same poster
    if (loading) return; // Prevent changing poster while loading
    setFirstLoad(false); // Set firstLoad to false after the first change
    setLoading(true);
    const img = new Image();
    img.src = poster.src;
    img.onload = () => {
      setSelectedPoster(poster);
      setLoading(false);
    };
  };

  const rate8 = rate1 * 8;

const [downloadStatus, setDownloadStatus] = useState(false);

//for downloading the image from html2canvas
const downloadImage = () => {
  if (!posterRef.current) return;
  setDownloadStatus(true);
  html2canvas(posterRef.current, { scale: 2 }).then((canvas) => {
    const link = document.createElement("a");
    link.download = `Adhuni-gold-rate-${date}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    /*2 seconds delay to show the spinner*/
    setTimeout(() => {
      setDownloadStatus(false);
    }, 2000);
  });
};

// for hovering effects of preview image
 const [transform, setTransform] = useState('');
  const [boxShadow, setBoxShadow] = useState('');
  const [border, setBorder] = useState('');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (x - centerX) / 10;

    setTransform(`perspective(1000px) translate(-2px, -2px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    setBoxShadow('10px 15px 20px rgba(0, 0, 0, 0.55)');
    setBorder('2px solid rgba(255, 255, 255, 0.95)');
  };

  const handleMouseOut = () => {
    setTransform('');
    setBoxShadow('');
    setBorder('');
  };

  return (
    <div className="App">
    <div className="App-left">
    <img src={logo} alt="Adhuni Gold" className="App-logo" />
      <h1>Adhuni Gold</h1>
      <h2>Gold Rate Poster Generator</h2>

      {/* Form */}
      <div className="form">
      <div className="form-header">
        <h3>Enter Details</h3>
        <br />
        <div className="form-header-content">
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          1 Gram Rate:
          <input
            type="text"
            value={rate1}
            onChange={(e) => setRate1(Number(e.target.value))}
          />
        </label>
        </div>
      </div>

      {/* Poster color options */}
      <div className="poster-color-options">
      <label>
          Choose Poster Color:
      <div className="color-options">
        {posterColors.map((poster) => (
          <div
            key={poster.name}
            className={`color-box ${
              selectedPoster.name === poster.name ? "active" : ""
            }`}
            style={{ backgroundColor: poster.color }}
            onClick={() => handlePosterChange(poster)}
          ></div>
        ))}
      </div>
      </label>
      </div>
      </div>

      {/* Instructions */}
      <h3 className="instruction-title">Instructions</h3>
      <p className="instructions">
        Select a poster color, enter the date and 1 gram rate, and click the <em>"Download Poster"</em>  button to generate a poster and save it to
        your device.
      </p>
        </div>
    <div className="App-right">
      {/* Preview image (smaller) */}
      <div className="poster-wrapper">
        <div className="poster preview"
         onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
      style={{
        transform,
        boxShadow,
        border,
        transition: 'transform 0.1s, box-shadow 0.1s',
      }}
        >
          {loading || firstLoad ? (
          <div className="skeleton"></div>
        ) : (
          <img src={selectedPoster.src} alt={selectedPoster.name} />
        )}
          <div className="date-text" style={loading ? { opacity: 0 } : null}>{displayDate(date)}</div>
          <div className="rate1-text" style={loading ? { opacity: 0 } : null}>₹ {rate1}</div>
          <div className="rate8-text" style={loading ? { opacity: 0 } : null}>₹ {rate8}</div>
        </div>
      </div>

      {/* Full res for screen grab */}
      <div className="poster-wrapper">
        <div className="poster full" ref={posterRef}>
          <img src={selectedPoster.src} alt={selectedPoster.name} />
          <div className="date-text">{displayDate(date)}</div>
          <div className="rate1-text">₹ {rate1}</div>
          <div className="rate8-text">₹ {rate8}</div>
        </div>
      </div>

      {/* Download button with loading indicator as :before */}
      
      <button onClick={downloadImage}>
  {downloadStatus ? (
                    <div className="spinner-container">
                      <div className="spinner spinner--button" />
                      <span>Downloading...</span>
                    </div>
                  ) : (
                    <span>Download Poster</span>
                  )}
</button>
    </div>
    </div>
  );
}

export default App;
