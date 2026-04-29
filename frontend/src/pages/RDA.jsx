import GlobalVoiceBtn from '../components/GlobalVoiceBtn';
import VoiceTextarea from '../components/VoiceTextarea';
import { useState, useEffect } from 'react';
import { patients } from '../data/mockData';
import '../print.css';

const RDA = ({ goTo }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fecha: '', hora: '', numRda: '',
    tipoConsulta: 'Primera vez', regimen: 'EPS – Contributivo', profesional: 'Opt. Andrea Salcedo',
    dxCie10: '', planFormulacion: '', pioOD: '', pioOI: '', observaciones: ''
  });

  // Inicializar fecha, hora y número de RDA al cargar
  useEffect(() => {
    const now = new Date();
    setFormData(prev => ({
      ...prev,
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().slice(0, 5),
      numRda: 'OFT-' + String(Math.floor(Math.random() * 90000) + 10000)
    }));
  }, [selectedPatient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const guardarRDA = () => {
    alert('RDA guardado exitosamente.');
    goTo('dashboard');
  };

  // PASO 1: Búsqueda del Paciente
  if (!selectedPatient) {
    const filtered = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
      <div className="section active">
        <div className="card">
          <div className="card-head">
            <div className="card-title">🔍 Buscar Paciente para crear RDA</div>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '20px' }}>
              <input 
                type="text"
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                placeholder="Buscar paciente por nombre para el registro de atención..." 
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
                        regimen: 'Contributivo'
                      })}>
                        Crear RDA
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)' }}>No se encontraron pacientes registrados. Vaya a "Registro Paciente" primero.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // PASO 2: Formulario del RDA
  return (
    <div className="section active" id="sec-rda">
      <div className="card">
        <div className="card-head">
          <div className="card-title">🔬 RDA – Registro Diario de Atención Optométrica</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <GlobalVoiceBtn />
            <button className="btn success" onClick={guardarRDA}>💾 Guardar</button>
            <button className="btn" onClick={() => window.print()}>🖨️ Imprimir / PDF</button>
            <button className="btn danger" onClick={() => setSelectedPatient(null)}>✕ Cerrar RDA</button>
          </div>
        </div>

        {/* METADATOS DE LA ATENCIÓN */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="field" style={{ flex: 1, minWidth: '140px' }}><label>Fecha</label><input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} /></div>
          <div className="field" style={{ flex: 1, minWidth: '100px' }}><label>Hora</label><input type="time" name="hora" value={formData.hora} onChange={handleInputChange} /></div>
          <div className="field" style={{ flex: 2, minWidth: '200px' }}><label>Tipo de Consulta</label>
            <select name="tipoConsulta" value={formData.tipoConsulta} onChange={handleInputChange}>
              <option>Primera vez</option><option>Control</option><option>Urgencia</option><option>Post-quirúrgico</option>
            </select>
          </div>
          <div className="field" style={{ flex: 2, minWidth: '200px' }}><label>Régimen SGSSS</label>
            <select name="regimen" value={formData.regimen} onChange={handleInputChange}>
              <option>EPS – Contributivo</option><option>EPS – Subsidiado</option><option>Particular</option><option>ARL</option><option>SOAT</option>
            </select>
          </div>
          <div className="field" style={{ flex: 1, minWidth: '140px' }}><label>N° RDA</label><input type="text" value={formData.numRda} readOnly style={{ color: 'var(--accent3)' }} /></div>
        </div>

        <div style={{ padding: '14px 16px' }}>
          {/* DATOS DEL PACIENTE TRAÍDOS DESDE LA SELECCIÓN */}
          <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '10px', fontWeight: 700 }}>DATOS DEL PACIENTE</div>
          <div className="form-grid g3">
            <div className="field span2"><label>Paciente</label><input type="text" value={selectedPatient.nombre} readOnly /></div>
            <div className="field"><label>Documento</label><input type="text" value={selectedPatient.documento} readOnly /></div>
            <div className="field"><label>Edad</label><input type="text" value={selectedPatient.edad} readOnly /></div>
            <div className="field"><label>EPS</label><input type="text" value={selectedPatient.eps} readOnly /></div>
            <div className="field"><label>Profesional</label>
              <select name="profesional" value={formData.profesional} onChange={handleInputChange}>
                <option>Opt. Andrea Salcedo</option><option>Dr. Héctor Monsalve</option>
              </select>
            </div>
          </div>

          {/* AGUDEZA VISUAL Y REFRACCIÓN REDUCIDA */}
          <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', margin: '20px 0 10px', fontWeight: 700 }}>AGUDEZA VISUAL Y REFRACCIÓN RESUMIDA</div>
          <table className="eye-tbl" style={{ marginBottom: '16px' }}>
            <thead>
              <tr><th>Ojo</th><th>AV SC</th><th>AV CC</th><th>Esfera</th><th>Cilindro</th><th>Eje</th><th>Adición</th><th>AV Final</th></tr>
            </thead>
            <tbody>
              <tr><td className="eye-lbl">OD</td><td><input placeholder="20/" /></td><td><input placeholder="20/" /></td><td><input placeholder="+/-" /></td><td><input placeholder="+/-" /></td><td><input placeholder="°" /></td><td><input placeholder="+" /></td><td><input placeholder="20/" /></td></tr>
              <tr><td className="eye-lbl">OI</td><td><input placeholder="20/" /></td><td><input placeholder="20/" /></td><td><input placeholder="+/-" /></td><td><input placeholder="+/-" /></td><td><input placeholder="°" /></td><td><input placeholder="+" /></td><td><input placeholder="20/" /></td></tr>
            </tbody>
          </table>

          {/* DIAGNÓSTICOS Y PLAN */}
          <div className="form-grid g3">
            <div className="field"><label>PIO OD</label><input name="pioOD" value={formData.pioOD} onChange={handleInputChange} placeholder="mmHg" /></div>
            <div className="field"><label>PIO OI</label><input name="pioOI" value={formData.pioOI} onChange={handleInputChange} placeholder="mmHg" /></div>
            <div className="field"><label>Diagnóstico CIE-10 Principal</label><input name="dxCie10" value={formData.dxCie10} onChange={handleInputChange} placeholder="Código – Descripción" /></div>
            <div className="field span-full"><label>Plan / Formulación</label><input name="planFormulacion" value={formData.planFormulacion} onChange={handleInputChange} placeholder="Descripción rápida de la formulación óptica o medicamentos indicados…" /></div>
            <div className="field span-full"><label>Observaciones</label><VoiceTextarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} placeholder="Notas adicionales o recomendaciones especiales de la atención..." style={{ minHeight: '60px' }}></VoiceTextarea></div>
          </div>

          {/* ACCIONES DEL RDA */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button className="btn success" onClick={() => goTo('rips')}>🗂️ Generar RIPS JSON</button>
            <button className="btn dian" onClick={() => goTo('dian')}>🏛️ Facturar Electrónicamente</button>
            <button className="btn wa">📲 Notificar Paciente WA</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RDA;

