import React, { useContext, useRef, useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context.jsx";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  } = useContext(Context);

  const fileInputRef = useRef(null);
  const [attachedImage, setAttachedImage] = useState(null);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + " " + transcript);
    };
    recognition.onerror = (event) => {
      alert("Voice recognition error");
    };
    recognition.start();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setAttachedImage(imageUrl);
      setInput((prev) => prev + ` [Image attached: ${file.name}]`);
    }
  };

  const cardData = [
    {
      text: "Lemme know how the Gemini AI works. Explain the function and how to use.",
      icon: assets.compass_icon,
    },
    {
      text: "Briefly explain the process of Photosynthesis.",
      icon: assets.bulb_icon,
    },
    { text: "From where did cricket originate?", icon: assets.message_icon },
    { text: "Improve the efficiency of this code.", icon: assets.code_icon },
  ];

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, John</span>
              </p>
              <p>How can I help you today ?</p>
            </div>
            <div className="cards">
              {cardData.map((card, index) => (
                <div key={index} className="card">
                  <p>{card.text}</p>
                  <img src={card.icon} alt="" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
              {attachedImage && (
                <div style={{ marginTop: "10px" }}>
                  <p>Attached Image Preview:</p>
                  <img
                    src={attachedImage}
                    alt="Preview"
                    style={{ maxWidth: "200px", borderRadius: "10px" }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  onSent();
                }
              }}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              {/* Image Upload */}
              <img
                src={assets.gallery_icon}
                alt=""
                onClick={() => fileInputRef.current.click()}
                style={{ cursor: "pointer" }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              {/* Voice Input */}
              <img
                src={assets.mic_icon}
                alt=""
                onClick={handleVoiceInput}
                style={{ cursor: "pointer" }}
              />

              {/* Send Button */}
              {input ? (
                <img
                  onClick={() => onSent()}
                  src={assets.send_icon}
                  alt=""
                  style={{ cursor: "pointer" }}
                />
              ) : null}
            </div>
          </div>
          <div className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check responses. Your privacy and Gemini Apps.
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Main);
