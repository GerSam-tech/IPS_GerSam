import GlobalVoiceBtn from '../components/GlobalVoiceBtn';
import VoiceTextarea from '../components/VoiceTextarea';
import { useState } from 'react';
import { patients } from '../data/mockData';

const Agenda = ({ goTo }) => {
  // Estado de las citas (Agenda interna)
  const [citas, setCitas] = useState([
    { id: 1, patientName: 'María Rodríguez Gómez', init: 'MR', av: 'av1', date: new Date().toISOString().split('T')[0], time: '08:00', reason: 'Control Miopía', prof: 'Opt. Andrea Salcedo', status: 'Confirmada' },
    { id: 2, patientName: 'Carlos Jiménez', init: 'CJ', av: 'av2', date: new Date().toISOString().split('T')[0], time: '08:45', reason: 'Examen de Rutina', prof: 'Dr. Héctor Monsalve', status: 'Pendiente' },
    { id: 3, patientName: 'Luisa Fernanda Arias', init: 'LF', av: 'av3', date: new Date().toISOString().split('T')[0], time: '09:30', reason: 'Adaptación Lentes de Contacto', prof: 'Opt. Andrea Salcedo', status: 'Confirmada' },
  ]);

  const [view, setView] = useState('list'); // 'list' | 'new'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    reason: 'Consulta de Primera Vez',
    prof: 'Opt. Andrea Salcedo'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const guardarCita = () => {
    if (!selectedPatient) {
      alert("Debes seleccionar un paciente primero.");
      return;
    }
    if (!formData.date || !formData.time) {
      alert("Debes seleccionar fecha y hora para la cita.");
      return;
    }

    const nuevaCita = {
      id: Date.now(),
      patientName: selectedPatient.name,
      init: selectedPatient.init,
      av: selectedPatient.av,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      prof: formData.prof,
      status: 'Confirmada'
    };

    // Agregar la cita ordenándola por hora (simulación básica)
    setCitas([...citas, nuevaCita].sort((a, b) => a.time.localeCompare(b.time)));
    
    alert(`✅ Cita guardada exitosamente para ${selectedPatient.name}.`);
    
    // Reset form y volver a la lista
    setSelectedPatient(null);
    setSearchTerm('');
    setView('list');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmada': return 'var(--green)';
      case 'Pendiente': return 'var(--amber)';
      case 'Cancelada': return 'var(--red)';
      case 'Atendido': return 'var(--accent1)';
      default: return 'var(--text3)';
    }
  };

  const enviarWA = (cita) => {
    // Formatea el mensaje para WhatsApp
    const msj = encodeURIComponent(`Hola ${cita.patientName},\nTe escribimos de GERSAM AXIS S.A.S para recordarte tu cita programada de *${cita.reason}* el día de hoy a las *${cita.time}* con el especialista ${cita.prof}.\n\n¡Por favor confirmar asistencia respondiendo este mensaje!`);
    // Abre la API de WhatsApp web/móvil
    window.open(`https://api.whatsapp.com/send?text=${msj}`, '_blank');
  };

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="section active">
      <div className="card">
        <div className="card-head">
          <div className="card-title">📅 Agenda de Citas</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <GlobalVoiceBtn />
            {view === 'list' ? (
              <button className="btn primary" onClick={() => setView('new')}>+ Agendar Nueva Cita</button>
            ) : (
              <button className="btn danger" onClick={() => { setView('list'); setSelectedPatient(null); }}>✕ Cancelar</button>
            )}
          </div>
        </div>

        {view === 'list' ? (
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--text)' }}>
                🗓️ Citas Programadas
              </div>
              <input type="date" className="tb-search" defaultValue={new Date().toISOString().split('T')[0]} style={{ padding: '6px 12px' }} />
            </div>

            <table className="tbl">
              <thead>
                <tr><th>Hora</th><th>Paciente</th><th>Motivo</th><th>Profesional</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {citas.map((cita) => (
                  <tr key={cita.id}>
                    <td style={{ fontWeight: 600, color: 'var(--accent1)' }}>{cita.time}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className={`av ${cita.av}`}>{cita.init}</div>
                        <span>{cita.patientName}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '.75rem', color: 'var(--text2)' }}>{cita.reason}</td>
                    <td style={{ fontSize: '.75rem' }}>{cita.prof}</td>
                    <td>
                      <span style={{ fontSize: '.7rem', fontWeight: 600, color: getStatusColor(cita.status), padding: '2px 8px', borderRadius: '12px', background: `${getStatusColor(cita.status)}20` }}>
                        ● {cita.status}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn success" style={{ padding: '3px 6px', fontSize: '.7rem' }} onClick={() => goTo('hc')} title="Ir a Historia Clínica">📋 HC</button>
                      <button className="btn wa" style={{ padding: '3px 6px', fontSize: '.7rem', background: '#25D366', color: 'white', borderColor: '#25D366' }} onClick={() => enviarWA(cita)} title="Enviar Recordatorio por WhatsApp">💬 WA</button>
                    </td>
                  </tr>
                ))}
                {citas.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)' }}>No hay citas programadas para este día.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card-body">
            <div className="grid2">
              {/* PASO 1: SELECCIONAR PACIENTE */}
              <div style={{ borderRight: '1px solid var(--border)', paddingRight: '20px' }}>
                <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '14px', fontWeight: 700 }}>
                  1. SELECCIONAR PACIENTE
                </div>
                
                {!selectedPatient ? (
                  <>
                    <input 
                      type="text"
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      placeholder="Buscar paciente por nombre..." 
                      style={{ padding: '10px 14px', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: '8px', color: 'var(--text)', width: '100%', marginBottom: '14px' }} 
                    />
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {filteredPatients.map((p, i) => (
                        <div key={i} onClick={() => setSelectedPatient(p)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background .2s' }} className="hover-bg">
                          <div className={`av ${p.av}`}>{p.init}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '.8rem' }}>{p.name}</div>
                            <div style={{ fontSize: '.65rem', color: 'var(--text3)' }}>CC 1.0{Math.floor(Math.random()*9000000)}</div>
                          </div>
                          <button className="btn primary" style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: '.7rem' }}>Seleccionar</button>
                        </div>
                      ))}
                      {filteredPatients.length === 0 && (
                        <div style={{ padding: '14px', textAlign: 'center', fontSize: '.75rem', color: 'var(--text3)' }}>No encontrado. <a href="#" onClick={(e) => { e.preventDefault(); goTo('registro'); }} style={{ color: 'var(--accent1)' }}>Registrar nuevo paciente</a>.</div>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '16px', background: 'rgba(0,180,216,0.05)', border: '1px solid var(--accent1)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={`av ${selectedPatient.av}`}>{selectedPatient.init}</div>
                    <div>
                      <div style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--accent1)' }}>{selectedPatient.name}</div>
                      <div style={{ fontSize: '.7rem', color: 'var(--text2)' }}>Paciente seleccionado</div>
                    </div>
                    <button className="btn" style={{ marginLeft: 'auto', fontSize: '.7rem', padding: '4px 8px' }} onClick={() => setSelectedPatient(null)}>Cambiar</button>
                  </div>
                )}
              </div>

              {/* PASO 2: DATOS DE LA CITA */}
              <div style={{ paddingLeft: '10px' }}>
                <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '14px', fontWeight: 700 }}>
                  2. DETALLES DE LA CITA
                </div>
                <div className="form-grid g2">
                  <div className="field"><label>Fecha</label><input type="date" name="date" value={formData.date} onChange={handleInputChange} disabled={!selectedPatient} /></div>
                  <div className="field"><label>Hora</label><input type="time" name="time" value={formData.time} onChange={handleInputChange} disabled={!selectedPatient} /></div>
                  <div className="field span2"><label>Motivo de Consulta</label>
                    <select name="reason" value={formData.reason} onChange={handleInputChange} disabled={!selectedPatient}>
                      <option>Consulta de Primera Vez</option>
                      <option>Consulta de Control</option>
                      <option>Examen Visual de Rutina</option>
                      <option>Adaptación Lentes de Contacto</option>
                      <option>Urgencia Oftalmológica / Optométrica</option>
                    </select>
                  </div>
                  <div className="field span2"><label>Profesional Asignado</label>
                    <select name="prof" value={formData.prof} onChange={handleInputChange} disabled={!selectedPatient}>
                      <option>Opt. Andrea Salcedo</option>
                      <option>Dr. Héctor Monsalve</option>
                    </select>
                  </div>
                  <div className="field span2"><label>Notas Adicionales</label><VoiceTextarea placeholder="Requerimientos especiales, recordar traer exámenes anteriores..." disabled={!selectedPatient} style={{ minHeight: '60px' }}></VoiceTextarea></div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn success" onClick={guardarCita} disabled={!selectedPatient} style={{ padding: '10px 20px', opacity: selectedPatient ? 1 : 0.5 }}>
                    ✅ Confirmar y Agendar Cita
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agenda;
