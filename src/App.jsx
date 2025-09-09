import React, { useState, useRef, useEffect } from "react"; // Import useEffect
import html2canvas from "html2canvas";
import "./App.css";
import posterColors from "./templates"; // template images
import logo from "./assets/Adhuni Gold logo b.jpg"; // logo image
import inr from "./assets/rupee.svg"; // rupee icon
import up from "./assets/up.svg";
import down from "./assets/down.svg";

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

  // Initialize selectedPoster as null to indicate no image is loaded yet.
  // Set loading to true initially as the app is starting to load its content.
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use useEffect to handle the initial loading of the default poster.
  // This hook runs once after the initial render because of the empty dependency array [].
  useEffect(() => {
    // Only proceed if selectedPoster is truly null, ensuring this runs only on initial mount.
    if (selectedPoster === null) {
      const defaultPoster = posterColors[4]; // Your intended default poster
      setLoading(true); // Indicate loading has started
      const img = new Image();
      img.src = defaultPoster.src;

      img.onload = () => {
        // Once the image is loaded, update the state and stop loading.
        setSelectedPoster(defaultPoster);
        setLoading(false);
      };

      img.onerror = () => {
        // Handle potential errors during image loading
        console.error("Failed to load default poster image.");
        setLoading(false); // Stop loading even if there's an error
        // You might want to set a fallback image here if the default fails
      };
    }
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  // This function is called when a user selects a new poster color.
  const handlePosterChange = (poster) => {
    setLoading(true); // Start loading for the new poster
    const img = new Image();
    img.src = poster.src;
    img.onload = () => {
      setSelectedPoster(poster);
      setLoading(false); // New poster loaded, stop loading
    };
    img.onerror = () => {
      console.error("Failed to load poster image:", poster.src);
      setLoading(false); // Stop loading even if there's an error
      // You might want to set a fallback image for user selections too
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
      link.download = `Adhuni-gold-rate-${displayDate(date)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      /*2 seconds delay to show the spinner*/
      setTimeout(() => {
        setDownloadStatus(false);
      }, 2000);
    });
  };

  const [rateChange, setRateChange] = useState('0');

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
                  maxLength="5"
                />
              </label>
            </div>
          </div>

          {/* Input to enter change in rate from yesterday's rate*/}
          <div className="change-wrapper">
            <label>
              Change in Rate:
              <input
                type="text"
                value={rateChange}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === '-' || value === '+') {
                    setRateChange(value);
                  } else if (!isNaN(Number(value))) {
                    setRateChange(Number(value));
                  }
                }}
                maxLength="3"
              />
            </label>
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
                      selectedPoster && selectedPoster.name === poster.name ? "active" : ""
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
          >
            {/* Display skeleton if loading or if no poster is selected yet */}
            {loading || selectedPoster === null ? (
              <div className="skeleton"></div>
            ) : (
              // Removed onLoad from here as initial load is handled by useEffect
              <img src={selectedPoster.src} alt={selectedPoster.name} />
            )}
            <div className="date-text" style={loading ? { opacity: 0 } : null}>{displayDate(date)}</div>
            <div className="rate1-text" style={loading ? { opacity: 0 } : null}>
            <img className="rupee-icon" src={inr} alt="Rupee Icon" /> {rate1}</div>
            <div className="rate8-text" style={loading ? { opacity: 0 } : null}>
            <img className="rupee-icon" src={inr} alt="Rupee Icon" /> {rate8}</div>
            {(rateChange !== '0' && rateChange !== '') && 
            <div className="change-in-rate-text" style={loading ? { opacity: 0 } : null}>
              <div className="blurred-bg"></div>
              {rateChange > 0 && <img src={up} alt="up" className="change-rate-icon" />}
              {rateChange < 0 && <img src={down} alt="down" className="change-rate-icon" />}
              {rateChange > 0 ? `+${rateChange}` : rateChange} /gram
            </div>}
          </div>
        </div>

        {/* Full res for screen grab */}
        <div className="poster-wrapper">
          <div className="poster full" ref={posterRef}>
            {/* Added optional chaining (?) to prevent errors if selectedPoster is null initially */}
            <img src={selectedPoster?.src} alt={selectedPoster?.name} />
            <div className="date-text">{displayDate(date)}</div>
            <div className="rate1-text">
            <img className="rupee-icon" src={inr} alt="Rupee Icon" /> {rate1}</div>
            <div className="rate8-text">
            <img className="rupee-icon" src={inr} alt="Rupee Icon" /> {rate8}</div>
            {(rateChange !== '0' && rateChange !== '') && 
            <div className="change-in-rate-text" style={loading ? { opacity: 0 } : null}>
              <div className="blurred-bg"></div>
              {rateChange > 0 && <img src={up} alt="up" className="change-rate-icon" />}
              {rateChange < 0 && <img src={down} alt="down" className="change-rate-icon" />}
              {rateChange > 0 ? `+${rateChange}` : rateChange} /gram
            </div>}
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