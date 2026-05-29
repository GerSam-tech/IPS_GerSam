import { useState, useRef, useEffect } from 'react';
import { patients } from '../data/mockData';

const Topbar = ({ title, goTo, isCollapsed }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPatients = searchTerm.length > 0 
    ? patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.doc && p.doc.includes(searchTerm))) 
    : [];

  const recognitionRef = useRef(null);

  const toggleVoice = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Lo sentimos, tu navegador no soporta dictado por voz. Usa Chrome o Edge en un sitio seguro (HTTPS o localhost).");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-CO';
    recognition.continuous = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      // Remover posible punto final que añade la API de Google/Edge
      const transcript = e.results[0][0].transcript.replace(/\.$/, '').trim();
      setSearchTerm(transcript);
      setShowResults(true);
    };
    recognition.onerror = (evt) => {
      console.error("Speech recognition error", evt.error);
      setIsListening(false);
      if (evt.error === 'not-allowed') {
        alert("Permiso de micrófono denegado. Por favor, habilítalo en tu navegador.");
      } else if (evt.error === 'no-speech') {
        alert("El navegador no detectó ningún sonido. Por favor revisa que el micrófono correcto esté seleccionado (ícono de cámara/micrófono en la barra de direcciones) y que no esté silenciado.");
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

  const handleSelectPatient = (p) => {
    setShowResults(false);
    setSearchTerm('');
    // Al seleccionar, los llevamos a Historia Clínica como acceso rápido
    goTo('hc');
  };
  return (
    <div className="topbar" id="topbar">
      <div className="tb-title" id="tb-title">{title}</div>
      <div className="tb-spacer"></div>
      <div className="tb-search" ref={searchRef} style={{ position: 'relative' }}>
        <span style={{ color: 'var(--text3)', fontSize: '.85rem' }}>🔍</span>
        <input 
          placeholder="Buscar paciente, ID, diagnóstico…" 
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
        />
        
        {/* Dropdown de resultados */}
        {showResults && searchTerm.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', marginTop: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 100, maxHeight: '300px', overflowY: 'auto' }}>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p, i) => (
                <div key={i} onClick={() => handleSelectPatient(p)} className="hover-bg" style={{ padding: '10px 14px', borderBottom: '1px solid var(--border2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className={`av ${p.av}`} style={{ width: '28px', height: '28px', fontSize: '.6rem', flexShrink: 0 }}>{p.init}</div>
                  <div>
                    <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--text)' }}>{p.name}</div>
                    <div style={{ fontSize: '.65rem', color: 'var(--text3)' }}>{p.dx || 'Paciente del sistema'}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '14px', fontSize: '.75rem', color: 'var(--text3)', textAlign: 'center' }}>No se encontraron pacientes.</div>
            )}
          </div>
        )}
      </div>
      <button className="tb-btn green" onClick={toggleVoice} style={{ background: isListening ? 'var(--red)' : '', color: isListening ? 'white' : '' }} title="Búsqueda por Voz">
        {isListening ? '🔴 Escuchando...' : '🎙️ Voz'}
      </button>
      <button className="tb-btn wa" onClick={() => window.open('https://web.whatsapp.com/', '_blank')} title="Abrir WhatsApp Web">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp Web
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div className="status-dot"></div>
        <span style={{ fontSize: '.72rem', color: 'var(--green)', fontWeight: 600 }}>DIAN Online</span>
      </div>
      <button className="tb-btn primary" onClick={() => goTo('registro')}>+ Nuevo Paciente</button>
    </div>
  );
};

export default Topbar;
