import { useState, useEffect, useRef } from 'react';

const GlobalVoiceBtn = () => {
  const [isListening, setIsListening] = useState(false);
  const lastFocusedInput = useRef(null);

  useEffect(() => {
    const handleFocusIn = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        lastFocusedInput.current = e.target;
      }
    };
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, []);

  const toggleVoice = (e) => {
    e.preventDefault();
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Tu navegador no soporta dictado por voz.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-CO';
    recognition.continuous = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (evt) => {
      const transcript = evt.results[0][0].transcript.replace(/\.$/, '').trim();
      
      if (lastFocusedInput.current) {
        const input = lastFocusedInput.current;
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const currentVal = input.value;
        const before = currentVal.substring(0, start);
        const after = currentVal.substring(end, currentVal.length);
        
        const space = before && !before.endsWith(' ') && !before.endsWith('\n') ? ' ' : '';
        const insertText = space + transcript;
        
        const newVal = before + insertText + after;
        
        // Forzar la actualización en React
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        
        if (input.tagName === 'TEXTAREA') {
          nativeTextareaValueSetter.call(input, newVal);
        } else {
          nativeInputValueSetter.call(input, newVal);
        }
        
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
        
        // Recuperar el foco
        input.focus();
        setTimeout(() => {
          input.setSelectionRange(start + insertText.length, start + insertText.length);
        }, 0);
      } else {
        alert("Selecciona un campo de texto primero para dictar.");
      }
    };
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <button 
      className="btn"
      onMouseDown={(e) => e.preventDefault()} // Evita quitar el foco del input activo
      onClick={toggleVoice}
      title="Dictado Global por Voz (Clickea cualquier campo, luego aquí)"
      style={{ 
        padding: '6px 12px', 
        borderRadius: '50%',
        background: isListening ? 'var(--red)' : 'var(--bg2)',
        color: isListening ? 'white' : 'var(--text)',
        border: '1px solid var(--border)',
        boxShadow: isListening ? '0 0 10px rgba(255,0,0,0.5)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px'
      }}
    >
      {isListening ? '🔴' : '🎙️'}
    </button>
  );
};

export default GlobalVoiceBtn;
