import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "./App.css";
import template from "./assets/template-red.jpg"; // put your template image here
import logo from "./assets/Adhuni Gold logo b.jpg"; // put your logo image here

function App() {
  const currentDate = new Date();
const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;
  const [date, setDate] = useState(formattedDate);
  const [rate1, setRate1] = useState(0);
  const posterRef = useRef(null);

  const rate8 = rate1 * 8;

  const downloadImage = () => {
    if (!posterRef.current) return;
    html2canvas(posterRef.current, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `Adhuni-gold-rate-${date}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="App">
    <img src={logo} alt="Adhuni Gold" className="App-logo" />
      <h1>Adhuni Gold</h1>
      <h2>Gold Rate Poster Generator</h2>

      {/* Form */}
      <div className="form">
        <label>
          Date:
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          1 Gram Rate:
          <input
            type="number"
            value={rate1}
            onChange={(e) => setRate1(Number(e.target.value))}
          />
        </label>
      </div>

      {/* Instructions */}
      <p className="instructions">
        Change the date and rate above, and Click the <em>"Download Poster"</em>  button to generate a poster and save it to
        your device.
      </p>

      {/* Preview image (smaller) */}
      <div className="poster-wrapper">
        <div className="poster preview">
          <img src={template} alt="template" className="bg" />
          <div className="date-text">{date}</div>
          <div className="rate1-text">₹ {rate1}</div>
          <div className="rate8-text">₹ {rate8}</div>
        </div>
      </div>

      {/* Full res for screen grab */}
      <div className="poster-wrapper">
        <div className="poster full" ref={posterRef}>
          <img src={template} alt="template" className="bg" />
          <div className="date-text">{date}</div>
          <div className="rate1-text">₹ {rate1}</div>
          <div className="rate8-text">₹ {rate8}</div>
        </div>
      </div>

      {/* Download */}
      <button onClick={downloadImage}>Download Poster</button>
    </div>
  );
}

export default App;
