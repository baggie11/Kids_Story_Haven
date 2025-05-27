'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { FaVolumeUp, FaTimes, FaPlay, FaStop, FaPause } from 'react-icons/fa';

const VoicePronouncer = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const particlesContainerRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
  const loadVoices = () => {
    const loadedVoices = window.speechSynthesis.getVoices();
    if (loadedVoices.length > 0) {
      // Filter for English voices only
      const englishVoices = loadedVoices.filter(voice => 
        voice.lang.includes('en') || voice.lang.includes('EN')
      );
      
      setVoices(englishVoices);
      if (englishVoices.length > 0) {
        setSelectedVoice(englishVoices[0]);
      }
    }
  };

  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;

  return () => {
    window.speechSynthesis.onvoiceschanged = null;
  };
}, []);

  useEffect(() => {
    if (cardVisible && particlesContainerRef.current) {
      createParticles();
    }
  }, [cardVisible]);

  const createParticles = () => {
    const container = particlesContainerRef.current;
    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 20 + 5;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 20 + 10;
      const opacity = Math.random() * 0.2 + 0.1;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${posX}%;
        top: ${posY + 100}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${opacity};
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(135deg, #4361ee, #7209b7);
        animation: float linear infinite;
      `;
      container.appendChild(particle);
    }
  };

  const toggleCard = () => {
    setCardVisible(!cardVisible);
    if (!cardVisible) {
      setTimeout(createParticles, 10);
    } else {
      handleStop();
    }
  };

  const handleSpeak = () => {
    if (!text.trim()) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (utteranceRef.current) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onend = () => {
          setIsPlaying(false);
          utteranceRef.current = null;
        };
        utterance.onerror = () => {
          setIsPlaying(false);
          utteranceRef.current = null;
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    utteranceRef.current = null;
  };

  return (
    <div className="font-['Poppins']">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(-100vh) rotate(360deg); }
          }
        `}</style>
      </Head>

      <div className="fixed bottom-24 right-8 z-50 flex flex-col items-end gap-4 ">
        <div className={`bg-white/20 backdrop-blur-lg rounded-3xl border border-white/25 shadow-[0_15px_35px_rgba(31,38,135,0.2)] p-6 w-[350px] relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${cardVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 pointer-events-none'}`}>
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[50px] -z-10" style={{ background: 'radial-gradient(circle, rgba(115,9,183,0.1) 0%, rgba(67,97,238,0.15) 50%, rgba(76,201,240,0.1) 100%)' }} />


          <div ref={particlesContainerRef} className="absolute w-full h-full top-0 left-0 pointer-events-none -z-10" />

          <div className="mb-4">
            <label className="block mb-2 text-[#3a0ca3] font-semibold text-sm">Enter your text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type what you want to hear pronounced..."
              className="w-full p-3 rounded-xl border-2 border-[rgba(67,97,238,0.2)] bg-white/80 text-sm resize-y min-h-[100px] focus:outline-none focus:border-[#7209b7] focus:ring-3 focus:ring-[#7209b7]/20"
            />
          </div>

          <div className="flex gap-3 mb-4">
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value);
                setSelectedVoice(voice);
              }}
              className="flex-1 p-2 rounded-xl border-2 border-[rgba(67,97,238,0.2)] bg-white/80 text-sm text-[#333]"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={handleSpeak}
              disabled={!text.trim()}
              className="flex-1 p-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white bg-gradient-to-r from-[#4361ee] to-[#7209b7] shadow-lg"
            >
              {isPlaying ? <><FaPause /><span>Pause</span></> : <><FaPlay /><span>Pronounce</span></>}
            </button>
            <button
              onClick={handleStop}
              disabled={!isPlaying}
              className="flex-1 p-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-white/80 text-[#3a0ca3] border-2 border-[rgba(67,97,238,0.3)]"
            >
              <FaStop /><span>Stop</span>
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <Control label="Speed" value={rate} min={0.5} max={2} step={0.1} onChange={setRate} />
            <Control label="Pitch" value={pitch} min={0} max={2} step={0.1} onChange={setPitch} />
            <Control label="Volume" value={volume} min={0} max={1} step={0.1} onChange={setVolume} />
          </div>
        </div>

        <button
          onClick={toggleCard}
          className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 bg-gradient-to-r from-[#4361ee] to-[#7209b7]"
        >
          {cardVisible ? <FaTimes className="text-xl" /> : <FaVolumeUp className="text-xl" />}
        </button>
      </div>
    </div>
  );
};

const Control = ({ label, value, onChange, min, max, step }) => (
  <div>
    <div className="flex justify-between mb-2 text-sm text-[#3a0ca3] font-semibold">
      <span>{label}</span>
      <span>{value.toFixed(1)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 rounded-lg bg-gradient-to-r from-[#4361ee] to-[#7209b7] appearance-none"
    />
  </div>
);

export default VoicePronouncer;
