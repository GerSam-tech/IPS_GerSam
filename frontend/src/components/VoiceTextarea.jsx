import { useState, useRef } from 'react';

const VoiceTextarea = ({ name, value, onChange, placeholder, style, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const textareaRef = useRef(null);

  const actualValue = value !== undefined ? value : internalValue;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    } else {
      setInternalValue(e.target.value);
    }
  };

  const recognitionRef = useRef(null);

  const toggleVoice = (e) => {
    e.preventDefault();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Lo sentimos, tu navegador no soporta dictado por voz. Asegúrate de usar un navegador compatible y estar en un entorno seguro.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-CO';
    recognition.continuous = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (evt) => {
      let transcript = evt.results[0][0].transcript.replace(/\.$/, '').trim();
      
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart || 0;
        const end = textarea.selectionEnd || 0;
        const currentVal = textarea.value;
        const before = currentVal.substring(0, start);
        const after = currentVal.substring(end, currentVal.length);
        
        const space = before && !before.endsWith(' ') && !before.endsWith('\n') ? ' ' : '';
        const insertText = space + transcript;
        const newVal = before + insertText + after;
        
        // 1. Forzar la actualización nativa del DOM
        const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeTextareaValueSetter.call(textarea, newVal);
        
        // Encontrar y llamar directamente al onChange de React
        const reactKey = Object.keys(textarea).find(key => 
          key.startsWith('__reactProps$') || 
          key.startsWith('__reactEventHandlers$') || 
          key.startsWith('__reactFiber$')
        );
        if (reactKey && textarea[reactKey]) {
          const props = textarea[reactKey];
          if (props.onChange) {
            try {
              props.onChange({ 
                target: textarea,
                currentTarget: textarea,
                preventDefault: () => {},
                stopPropagation: () => {}
              });
            } catch (e) {
              console.error("Error calling React onChange on textarea directly:", e);
            }
          }
        }

        // 2. Despachar eventos estándar del DOM
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
        
        // 3. Actualizar estado local/React
        handleChange({ target: { name, value: newVal } });
        
        // 4. Devolver foco y posición del cursor
        textarea.focus();
        setTimeout(() => {
          textarea.setSelectionRange(start + insertText.length, start + insertText.length);
        }, 0);
      } else {
        // Fallback si no está la ref
        const separator = actualValue && !actualValue.endsWith(' ') && !actualValue.endsWith('\n') ? ' ' : '';
        const newVal = actualValue ? `${actualValue}${separator}${transcript}` : transcript;
        handleChange({ target: { name, value: newVal } });
      }
    };
    recognition.onerror = (evt) => {
      console.error("Speech recognition error", evt.error);
      setIsListening(false);
      if (evt.error === 'not-allowed') {
        alert("Permiso de micrófono denegado. Por favor, habilita el acceso al micrófono en tu navegador.");
      } else if (evt.error === 'no-speech') {
        alert("El navegador no detectó ningún sonido. Por favor revisa que el micrófono correcto esté seleccionado (ícono de cámara/micrófono en la barra de direcciones) y que no esté silenciado.");
      } else if (evt.error === 'network') {
        alert("Error de red: No se pudo conectar con el servicio de reconocimiento de voz de Google. Verifica tu conexión a Internet o intenta nuevamente.");
      } else if (evt.error === 'service-not-allowed') {
        alert("Error de servicio: El reconocimiento de voz no está permitido en este sitio o navegador por razones de seguridad o configuración.");
      } else {
        alert(`Error de dictado por voz: ${evt.error}`);
      }
    };
    recognition.onend = () => setIsListening(false);
    
    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <textarea 
        ref={textareaRef}
        name={name} 
        value={actualValue} 
        onChange={handleChange} 
        placeholder={placeholder} 
        style={{ ...style, paddingRight: '40px', width: '100%', boxSizing: 'border-box' }} 
        disabled={disabled}
      />
      <button 
        onMouseDown={(e) => e.preventDefault()} // Evita quitar el foco en desktop
        onTouchStart={(e) => e.preventDefault()} // Evita quitar el foco en móviles
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
