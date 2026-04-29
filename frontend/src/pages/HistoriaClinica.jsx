import GlobalVoiceBtn from '../components/GlobalVoiceBtn';
import VoiceTextarea from '../components/VoiceTextarea';
import { useState } from 'react';
import { patients, sintomasList, cie10List } from '../data/mockData';
import '../print.css'; // Estilos especiales para impresión

const HistoriaClinica = ({ goTo }) => {
  // Lógica de selección de paciente
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica interna de la HC
  const [activeTab, setActiveTab] = useState('anamnesis');
  const [activeCie10, setActiveCie10] = useState([]);
  const [formData, setFormData] = useState({
    motivoConsulta: '', antecedentesOculares: '', antecedentesSistemicos: '', medicamentos: '',
    agudezaVisual: {}, refraccion: {},
    diagnosticoDefinitivo: '', tipoDiagnostico: 'Definitivo',
    planManejo: '', medicamentosFormulados: '', proximaCita: ''
  });

  const toggleCie10 = (c) => {
    if (activeCie10.includes(c)) {
      setActiveCie10(activeCie10.filter(item => item !== c));
    } else {
      setActiveCie10([...activeCie10, c]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const guardarHC = () => {
    alert('Historia Clínica guardada y firmada exitosamente.');
    goTo('dashboard');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // PASO 1: Si no hay paciente seleccionado, mostrar la búsqueda
  if (!selectedPatient) {
    const filtered = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
      <div className="section active">
        <div className="card">
          <div className="card-head">
            <div className="card-title">🔍 Buscar Paciente para Historia Clínica</div>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '20px' }}>
              <input 
                type="text"
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                placeholder="Buscar paciente por nombre..." 
                style={{ padding: '10px 14px', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: '8px', color: 'var(--text)', fontFamily: 'Inter, sans-serif', fontSize: '.85rem', outline: 'none', width: '100%', maxWidth: '400px' }} 
              />
            </div>
            <table className="tbl">
              <thead>
                <tr><th>Paciente</th><th>Último Diagnóstico</th><th>Profesional Tratante</th><th>Acción</th></tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className={`av ${p.av}`}>{p.init}</div>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text3)' }}>{p.dx}</td>
                    <td>{p.prof}</td>
                    <td>
                      <button className="btn primary" style={{ padding: '6px 12px', fontSize: '.75rem' }} onClick={() => setSelectedPatient({
                        nombre: p.name,
                        documento: `CC 1.0${Math.floor(1000000 + Math.random() * 9000000)}`,
                        edad: `${Math.floor(20 + Math.random() * 50)} años`,
                        eps: 'Sura EPS',
                        regimen: 'Contributivo',
                        horaConsulta: new Date().toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
                      })}>
                        Abrir HC
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)' }}>No se encontraron pacientes.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // PASO 2: Paciente seleccionado, mostrar la Historia Clínica completa
  return (
    <div className="section active" id="sec-hc">
      <div className="card">
        <div className="card-head">
          <div className="card-title">📋 Historia Clínica – Consulta y Registro (CIE-10)</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <GlobalVoiceBtn />
            <button className="btn success" onClick={guardarHC}>💾 Guardar HC</button>
            <button className="btn" onClick={handlePrint} title="Imprimir o Exportar a PDF">🖨️ Imprimir / Exportar PDF</button>
            <button className="btn danger" onClick={() => setSelectedPatient(null)}>✕ Cerrar HC</button>
          </div>
        </div>

        {/* HC PACIENTE HEADER */}
        <div style={{ padding: '10px 16px', background: 'rgba(0,180,216,.04)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg3)', border: '2px solid var(--accent1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', overflow: 'hidden' }}>
            👤
          </div>
          <div>
            <div style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--text)' }}>{selectedPatient.nombre}</div>
            <div style={{ fontSize: '.72rem', color: 'var(--text3)' }}>{selectedPatient.documento} · {selectedPatient.edad} · {selectedPatient.eps} · {selectedPatient.regimen}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
            <span className="pill pill-prog">Consulta activa</span>
            <span style={{ fontSize: '.72rem', color: 'var(--text3)', alignSelf: 'center' }}>{selectedPatient.horaConsulta}</span>
          </div>
        </div>

        <div className="tab-row">
          <div className={`tab ${activeTab === 'anamnesis' ? 'active' : ''}`} onClick={() => setActiveTab('anamnesis')}>Anamnesis</div>
          <div className={`tab ${activeTab === 'examen' ? 'active' : ''}`} onClick={() => setActiveTab('examen')}>Examen Optométrico</div>
          <div className={`tab ${activeTab === 'oftalmo' ? 'active' : ''}`} onClick={() => setActiveTab('oftalmo')}>Examen Oftalmológico</div>
          <div className={`tab ${activeTab === 'ayudas' ? 'active' : ''}`} onClick={() => setActiveTab('ayudas')}>Ayudas Diagnósticas</div>
          <div className={`tab ${activeTab === 'dx' ? 'active' : ''}`} onClick={() => setActiveTab('dx')}>Diagnóstico CIE-10</div>
          <div className={`tab ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>Plan y Tratamiento</div>
        </div>

        {/* TAB CONTENTS */}
        <div style={{ padding: '24px' }}>
          
          <div className={`tab-content ${activeTab === 'anamnesis' ? 'show' : ''}`}>
            <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '10px', fontWeight: 700 }}>MOTIVO DE CONSULTA</div>
            <div className="form-grid">
              <div className="field span-full" style={{ position: 'relative' }}>
                <label>Motivo de Consulta <span style={{ color: 'var(--accent3)', fontSize: '.65rem' }}>(🎙️ puede dictar)</span></label>
                <VoiceTextarea name="motivoConsulta" value={formData.motivoConsulta} onChange={handleInputChange} placeholder="Describa el motivo de consulta, inicio, duración, características…"></VoiceTextarea>
              </div>
            </div>

            <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', margin: '14px 0 10px', fontWeight: 700 }}>SÍNTOMAS VISUALES</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '6px' }}>
              {sintomasList.map((s, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: '5px', cursor: 'pointer', fontSize: '.75rem' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--accent1)' }} /> {s}
                </label>
              ))}
            </div>

            <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', margin: '14px 0 10px', fontWeight: 700 }}>ANTECEDENTES</div>
            <div className="form-grid g2">
              <div className="field"><label>Antecedentes Oculares</label><VoiceTextarea name="antecedentesOculares" value={formData.antecedentesOculares} onChange={handleInputChange} placeholder="Cirugías, trauma, patologías previas…" style={{ minHeight: '56px' }}></VoiceTextarea></div>
              <div className="field"><label>Antecedentes Sistémicos</label><VoiceTextarea name="antecedentesSistemicos" value={formData.antecedentesSistemicos} onChange={handleInputChange} placeholder="DM, HTA, tiroides, autoinmunes…" style={{ minHeight: '56px' }}></VoiceTextarea></div>
              <div className="field"><label>Medicamentos Actuales</label><input type="text" name="medicamentos" value={formData.medicamentos} onChange={handleInputChange} placeholder="Nombre, dosis, frecuencia…" /></div>
              <div className="field"><label>Alergias Conocidas</label><input type="text" placeholder="Medicamentos, sustancias..." /></div>
              <div className="field"><label>Uso de Lentes Correctivos</label>
                <select><option>No</option><option>Gafas monofocales</option><option>Gafas bifocales</option><option>Gafas progresivas</option><option>Lentes de contacto</option></select>
              </div>
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'examen' ? 'show' : ''}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '8px', fontWeight: 700 }}>AGUDEZA VISUAL</div>
                <table className="eye-tbl">
                  <thead><tr><th>Ojo</th><th>AV SC lejos</th><th>AV CC lejos</th><th>AV SC cerca</th><th>AV CC cerca</th><th>Pin Hole</th></tr></thead>
                  <tbody>
                    <tr><td className="eye-lbl">OD</td><td><input placeholder="20/" /></td><td><input placeholder="20/" /></td><td><input placeholder="J" /></td><td><input placeholder="J" /></td><td><input placeholder="20/" /></td></tr>
                    <tr><td className="eye-lbl">OI</td><td><input placeholder="20/" /></td><td><input placeholder="20/" /></td><td><input placeholder="J" /></td><td><input placeholder="J" /></td><td><input placeholder="20/" /></td></tr>
                    <tr><td className="eye-lbl">AO</td><td><input placeholder="20/" /></td><td><input placeholder="20/" /></td><td><input placeholder="J" /></td><td><input placeholder="J" /></td><td>–</td></tr>
                  </tbody>
                </table>
              </div>
              <div>
                <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '8px', fontWeight: 700 }}>REFRACCIÓN</div>
                <table className="eye-tbl">
                  <thead><tr><th>Ojo</th><th>Esfera (D)</th><th>Cilindro (D)</th><th>Eje (°)</th><th>Adición</th><th>Prisma</th><th>AV Final</th></tr></thead>
                  <tbody>
                    <tr><td className="eye-lbl">OD</td><td><input placeholder="+/-" /></td><td><input placeholder="+/-" /></td><td><input placeholder="0-180" /></td><td><input placeholder="+" /></td><td><input /></td><td><input placeholder="20/" /></td></tr>
                    <tr><td className="eye-lbl">OI</td><td><input placeholder="+/-" /></td><td><input placeholder="+/-" /></td><td><input placeholder="0-180" /></td><td><input placeholder="+" /></td><td><input /></td><td><input placeholder="20/" /></td></tr>
                  </tbody>
                </table>
              </div>
              <div className="form-grid g3" style={{ gap: '10px' }}>
                <div className="field"><label>Cover Test Lejos</label><input placeholder="Orto / Exo / Eso" /></div>
                <div className="field"><label>Cover Test Cerca</label><input placeholder="Orto / Exo / Eso" /></div>
                <div className="field"><label>Hirschberg</label><input placeholder="Centrado / Desviado" /></div>
                <div className="field"><label>PIO OD (mmHg)</label><input placeholder="10-21" /></div>
                <div className="field"><label>PIO OI (mmHg)</label><input placeholder="10-21" /></div>
                <div className="field"><label>Método PIO</label><select><option>No contacto</option><option>Goldmann</option><option>Icare</option></select></div>
              </div>
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'oftalmo' ? 'show' : ''}`}>
            <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '8px', fontWeight: 700 }}>SEGMENTO ANTERIOR – BIOMICROSCOPÍA</div>
            <table className="eye-tbl">
              <thead><tr><th>Estructura</th><th>OD</th><th>OI</th></tr></thead>
              <tbody>
                <tr><td className="eye-lbl">Párpados</td><td><input placeholder="Normal" /></td><td><input placeholder="Normal" /></td></tr>
                <tr><td className="eye-lbl">Conjuntiva</td><td><input placeholder="Blanca / sin inyección" /></td><td><input /></td></tr>
                <tr><td className="eye-lbl">Córnea</td><td><input placeholder="Transparente" /></td><td><input /></td></tr>
                <tr><td className="eye-lbl">Cámara Anterior</td><td><input placeholder="Profunda / limpia" /></td><td><input /></td></tr>
                <tr><td className="eye-lbl">Iris</td><td><input placeholder="Normal / plano" /></td><td><input /></td></tr>
                <tr><td className="eye-lbl">Pupila</td><td><input placeholder="Redonda / reactiva" /></td><td><input /></td></tr>
                <tr><td className="eye-lbl">Cristalino</td><td><input placeholder="Transparente" /></td><td><input /></td></tr>
              </tbody>
            </table>
          </div>

          <div className={`tab-content ${activeTab === 'ayudas' ? 'show' : ''}`}>
            <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '12px', fontWeight: 700 }}>AYUDAS DIAGNÓSTICAS ADJUNTAS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div className="photo-zone" style={{ width: '100%', height: '100px', aspectRatio: 'auto' }}>📊<div style={{ fontSize: '.65rem', marginTop: '4px' }}>Topografía</div></div>
              <div className="photo-zone" style={{ width: '100%', height: '100px', aspectRatio: 'auto' }}>🔬<div style={{ fontSize: '.65rem', marginTop: '4px' }}>OCT</div></div>
              <div className="photo-zone" style={{ width: '100%', height: '100px', aspectRatio: 'auto' }}>👁️<div style={{ fontSize: '.65rem', marginTop: '4px' }}>Campo Visual</div></div>
            </div>
            <div className="field">
              <label>Observaciones de Ayudas Diagnósticas</label>
              <VoiceTextarea placeholder="Describa hallazgos de topografía, OCT, campo visual, retinografía…" style={{ minHeight: '80px' }}></VoiceTextarea>
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'dx' ? 'show' : ''}`}>
            <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '12px', fontWeight: 700 }}>DIAGNÓSTICO CIE-10 – SELECCIÓN RÁPIDA</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {cie10List.map((x, i) => {
                const isActive = activeCie10.includes(x.c);
                return (
                  <span 
                    key={i} 
                    onClick={() => toggleCie10(x.c)}
                    style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', 
                      fontSize: '.72rem', fontWeight: 600, cursor: 'pointer', border: '1px solid', 
                      borderColor: isActive ? 'var(--accent1)' : 'var(--border)', 
                      background: isActive ? 'rgba(0,180,216,.15)' : 'var(--bg3)', 
                      color: isActive ? 'var(--accent1)' : 'var(--text3)', transition: 'all .15s', margin: '2px' 
                    }}>
                    {x.c} {x.d}
                  </span>
                );
              })}
            </div>
            <div className="form-grid" style={{ marginTop: '4px' }}>
              <div className="field span-full">
                <label>Diagnóstico(s) definitivo(s) con código CIE-10</label>
                <VoiceTextarea 
                  name="diagnosticoDefinitivo" 
                  value={activeCie10.map(c => `${c} - ${cie10List.find(x => x.c === c)?.d}`).join('\n')} 
                  readOnly
                  placeholder="Ej: H52.1 Miopía bilateral / H52.2 Astigmatismo OD…" 
                  style={{ minHeight: '70px' }}></VoiceTextarea>
              </div>
              <div className="field">
                <label>Tipo de Diagnóstico</label>
                <select name="tipoDiagnostico" value={formData.tipoDiagnostico} onChange={handleInputChange}>
                  <option>Definitivo</option><option>Impresión diagnóstica</option><option>Sospecha</option>
                </select>
              </div>
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'plan' ? 'show' : ''}`}>
            <div className="form-grid g2">
              <div className="field span2">
                <label>Plan de Manejo / Tratamiento</label>
                <VoiceTextarea name="planManejo" value={formData.planManejo} onChange={handleInputChange} placeholder="Descripción del plan terapéutico, procedimientos…" style={{ minHeight: '80px' }}></VoiceTextarea>
              </div>
              <div className="field">
                <label>Medicamentos Formulados (Receta)</label>
                <VoiceTextarea name="medicamentosFormulados" value={formData.medicamentosFormulados} onChange={handleInputChange} placeholder="Nombre, dosis, vía, frecuencia, duración…" style={{ minHeight: '70px' }}></VoiceTextarea>
              </div>
              <div className="field">
                <label>Remisiones / Interconsultas</label>
                <VoiceTextarea placeholder="Especialidad o servicio al que remite, razón…" style={{ minHeight: '70px' }}></VoiceTextarea>
              </div>
              <div className="field"><label>Próxima Cita</label><input type="date" name="proximaCita" value={formData.proximaCita} onChange={handleInputChange} /></div>
              <div className="field"><label>Educación al Paciente</label><VoiceTextarea placeholder="Instrucciones de uso, señales de alarma…" style={{ minHeight: '60px' }}></VoiceTextarea></div>
            </div>
            <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="btn primary" onClick={guardarHC}>✓ Firmar y Guardar HC</button>
              <button className="btn success" onClick={() => goTo('rips')}>🗂️ Generar RIPS</button>
              <button className="btn dian" onClick={() => goTo('dian')}>🏛️ Facturar DIAN</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HistoriaClinica;

