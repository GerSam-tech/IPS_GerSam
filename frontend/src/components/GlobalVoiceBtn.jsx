import { useState, useEffect, useRef } from 'react';

const GlobalVoiceBtn = () => {
  const [isListening, setIsListening] = useState(false);
  const lastFocusedInput = useRef(null);

  useEffect(() => {
    const handleFocus = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        lastFocusedInput.current = e.target;
      }
    };
    const handleClick = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        lastFocusedInput.current = e.target;
      }
    };
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  const recognitionRef = useRef(null);

  const toggleVoice = (e) => {
    e.preventDefault();
    
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Tu navegador no soporta dictado por voz. Asegúrate de usar un navegador compatible (como Chrome) y estar en un sitio seguro (HTTPS o localhost).");
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
        
        // Encontrar y llamar directamente al onChange de React para asegurar la actualización del estado
        const reactKey = Object.keys(input).find(key => 
          key.startsWith('__reactProps$') || 
          key.startsWith('__reactEventHandlers$') || 
          key.startsWith('__reactFiber$')
        );
        if (reactKey && input[reactKey]) {
          const props = input[reactKey];
          if (props.onChange) {
            try {
              props.onChange({ 
                target: input,
                currentTarget: input,
                preventDefault: () => {},
                stopPropagation: () => {}
              });
            } catch (e) {
              console.error("Error calling React onChange directly:", e);
            }
          }
        }

        // Despachar eventos estándar del DOM
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Recuperar el foco
        input.focus();
        setTimeout(() => {
          input.setSelectionRange(start + insertText.length, start + insertText.length);
        }, 0);
      } else {
        alert("Selecciona un campo de texto primero para dictar.");
      }
    };
    
    recognition.onerror = (evt) => {
      console.error("Speech recognition error", evt.error);
      setIsListening(false);
      
      setTimeout(() => {
        if (evt.error === 'not-allowed') {
          alert("Permiso de micrófono denegado. Por favor, habilita el acceso al micrófono en tu navegador.");
        } else if (evt.error === 'no-speech') {
          alert("El navegador no detectó ningún sonido. Por favor revisa que el micrófono correcto esté seleccionado (ícono de cámara/micrófono en la barra de direcciones) y que no esté silenciado.");
        } else if (evt.error === 'network') {
          alert("Error de red: No se pudo conectar con el servicio de reconocimiento de voz de Google. Si estás usando Brave, Opera u otro navegador privado, activa los servicios de voz de Google o prueba usando Google Chrome o Microsoft Edge.");
        } else if (evt.error === 'service-not-allowed') {
          alert("Error de servicio: El reconocimiento de voz no está permitido en este sitio o navegador por razones de seguridad o configuración.");
        } else {
          alert(`Error de dictado por voz: ${evt.error}`);
        }
      }, 100);
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
    <button 
      className="btn"
      onMouseDown={(e) => e.preventDefault()} // Evita quitar el foco del input activo en desktop
      onTouchStart={(e) => e.preventDefault()} // Evita quitar el foco del input activo en móviles
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
