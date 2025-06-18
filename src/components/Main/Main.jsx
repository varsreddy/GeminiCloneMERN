import React, { useEffect, useRef, useState, useContext } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main = () => {
  const {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    prevPrompts,
    setPrevPrompts,
    showResult,
    loading,
const Main = () => {
  const {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    prevPrompts,
    setPrevPrompts,
    showResult,
    loading,
    resultData,
    onSent,
  } = useContext(Context);

  const [isRecording, setIsRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const silenceTimer = useRef(null);
  const isManuallyStopped = useRef(false);

  // Optional: For image attachment (from other branch)
  // const fileInputRef = useRef(null);
  // const [attachedImage, setAttachedImage] = useState(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const startListening = () => {
    if (!SpeechRecognition) {
      setErrorMsg("Speech recognition is not supported.");
      return;
    }
    isManuallyStopped.current = false;
    transcriptRef.current = "";
    recognitionRef.current.start();
    resetSilenceTimer();
  };

  const stopListening = () => {
    isManuallyStopped.current = true;
    recognitionRef.current.stop();
    clearTimeout(silenceTimer.current);
    setIsRecording(false);
  };

  const resetSilenceTimer = () => {
    clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => {
      stopListening();
      if (!transcriptRef.current.trim()) {
        setErrorMsg("No voice detected. Please try again.");
      }
    }, 5000);
  };

  const handleMicClick = () => {
    if (isRecording) stopListening();
    else startListening();
  };

  const handleSend = async () => {
    stopListening();
    if (!input.trim()) {
      alert("Please enter a message.");
      return;
    }
    setPrevPrompts((prev) => [...prev, input]);
    setRecentPrompt(input);
    await onSent(input);
  };

  useEffect(() => {
    if (!SpeechRecognition) {
      setErrorMsg("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          transcriptRef.current += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }
      setInput((transcriptRef.current + interimTranscript).trim());
      resetSilenceTimer();
    };

    recognition.onerror = (event) => {
      setErrorMsg("Error: " + event.error);
      stopListening();
    };

    recognition.onend = () => {
      setInput(transcriptRef.current.trim());
      if (!isManuallyStopped.current) recognition.start();
    };

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    if (errorMsg) {
      alert(errorMsg);
      setErrorMsg("");
    }
  }, [errorMsg]);

    setRecentPrompt(text);
    onSent(text);
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="user" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p><span>Hello, John</span></p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              {cardData.map((card, index) => (
                <div key={index} className="card" onClick={() => handleCardClick(card.text)}>
                  <p>{card.text}</p>
                  <img src={card.icon} alt="icon" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="user" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="gemini" />
              {loading ? (
                <div className="loader"><hr /><hr /><hr /></div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <textarea
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak or type your prompt here..."
              value={input}
              rows={Math.max(3, input.split("\n").length)}
              style={{
                width: "100%",
                resize: "none",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "black",
                fontSize: "1rem",
                padding: "10px",
                lineHeight: "1.5",
                overflowY: "auto",
              }}
            />

            <div className="search-icons">
              <img
                src={isRecording ? assets.recording_icon : assets.mic_icon}
                alt="mic"
                onClick={handleMicClick}
              />

              {input && (
                <img
                  onClick={handleSend}
                  src={assets.send_icon}
                  alt="send"
                />
              )}
            </div>
          </div>

          {isRecording && (
            <div className="recording-indicator">🎙️ Listening...</div>
          )}

          <div className="bottom-info">
            Gemini may display inaccurate info, including about people. Always verify.
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Main);
