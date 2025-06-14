import React, { useContext } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/ContextProvider";

const Main = () => {
  // const [onSent,recentPrompt,showResult,loading,resultData,input,setInput] = useContext(Context);

  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  } = useContext(Context);

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
                  <hr/>
                  <hr/>
                  <hr/>
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
              
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              {input?<img onClick={() => onSent()} src={assets.send_icon} alt="" />:null}
            </div>
          </div>
          <div className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check responses.Your privacy and Gemini Apps.
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Main);
