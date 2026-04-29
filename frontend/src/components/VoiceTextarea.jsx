import { useState } from 'react';

const VoiceTextarea = ({ name, value, onChange, placeholder, style, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  const actualValue = value !== undefined ? value : internalValue;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    } else {
      setInternalValue(e.target.value);
    }
  };

  const toggleVoice = (e) => {
    e.preventDefault();
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Lo sentimos, tu navegador no soporta dictado por voz.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-CO';
    recognition.continuous = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (evt) => {
      let transcript = evt.results[0][0].transcript.replace(/\.$/, '').trim();
      // Si el primer carácter es minúscula y se añade a texto existente, ponemos espacio, sino normal
      const separator = actualValue && !actualValue.endsWith(' ') && !actualValue.endsWith('\n') ? ' ' : '';
      const newVal = actualValue ? `${actualValue}${separator}${transcript}` : transcript;
      
      handleChange({ target: { name, value: newVal } });
    };
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <textarea 
        name={name} 
        value={actualValue} 
        onChange={handleChange} 
        placeholder={placeholder} 
        style={{ ...style, paddingRight: '40px', width: '100%', boxSizing: 'border-box' }} 
        disabled={disabled}
      />
      <button 
        onClick={toggleVoice} 
        disabled={disabled}
        title="Dictado por voz"
        style={{ 
          position: 'absolute', 
          right: '8px', 
          bottom: '12px', 
          background: isListening ? 'var(--red)' : 'var(--bg2)', 
          color: isListening ? 'white' : 'var(--text)', 
          border: '1px solid var(--border)', 
          borderRadius: '50%', 
          width: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          cursor: disabled ? 'not-allowed' : 'pointer',
          zIndex: 10,
          fontSize: '12px',
          padding: 0,
          boxShadow: isListening ? '0 0 8px rgba(255,0,0,0.5)' : 'none',
          transition: 'all 0.2s'
        }}
      >
        {isListening ? '🔴' : '🎙️'}
      </button>
    </div>
  );
};

export default VoiceTextarea;
