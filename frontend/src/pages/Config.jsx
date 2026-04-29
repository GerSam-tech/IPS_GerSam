import GlobalVoiceBtn from '../components/GlobalVoiceBtn';
import { useState } from 'react';

const Config = () => {
  const [waConnected, setWaConnected] = useState(true);
  const [profesionales, setProfesionales] = useState([
    { id: 1, name: 'Opt. Andrea Salcedo', esp: 'Optometría', rm: 'RM-8845' },
    { id: 2, name: 'Dr. Héctor Monsalve', esp: 'Oftalmología', rm: 'RM-3201' }
  ]);

  const addProf = () => {
    const name = prompt("Nombre del Profesional:");
    const esp = prompt("Especialidad:");
    const rm = prompt("Registro Médico:");
    if (name) setProfesionales([...profesionales, { id: Date.now(), name, esp, rm }]);
  };

  const removeProf = (id) => {
    setProfesionales(profesionales.filter(p => p.id !== id));
  };

  return (
    <div className="section active">
      <div className="card">
        <div className="card-head">
          <div className="card-title">⚙️ Configuración del Sistema IPS</div>
          <GlobalVoiceBtn />
            <button className="btn success" onClick={() => alert('Configuración guardada.')}>💾 Guardar Cambios</button>
        </div>
        <div className="card-body" style={{ maxWidth: '800px' }}>
          
          <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '14px', fontWeight: 700 }}>
            DATOS DE LA CLÍNICA / PRESTADOR
          </div>
          <div className="form-grid g2" style={{ marginBottom: '24px' }}>
            <div className="field"><label>Nombre / Razón Social</label><input type="text" defaultValue="GERSAM AXIS S.A.S" /></div>
            <div className="field"><label>NIT</label><input type="text" defaultValue="900.123.456-7" /></div>
            <div className="field"><label>Código de Habilitación REPS</label><input type="text" defaultValue="0500201234" /></div>
            <div className="field"><label>Correo Principal</label><input type="email" defaultValue="contacto@gersamaxis.com" /></div>
            <div className="field span2"><label>Dirección Sede Principal</label><input type="text" defaultValue="Cl 12 #34-56, Medellín, Antioquia" /></div>
          </div>

          <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '14px', fontWeight: 700 }}>
            INTEGRACIONES
          </div>
          <div className="form-grid g2" style={{ marginBottom: '24px' }}>
            <div className="field span2" style={{ border: '1px solid var(--border)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Firma Electrónica Minsalud / DIAN</strong>
                <span style={{ fontSize: '.75rem', color: 'var(--text2)' }}>Certificado P12 cargado correctamente. Vence: 12 Dic 2026</span>
              </div>
              <button className="btn">Actualizar Certificado</button>
            </div>
            
            <div className="field span2" style={{ border: '1px solid var(--border)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>API WhatsApp Business</strong>
                {waConnected ? (
                  <span style={{ fontSize: '.75rem', color: 'var(--green)' }}>Conectado (Token Activo)</span>
                ) : (
                  <span style={{ fontSize: '.75rem', color: 'var(--red)' }}>Desconectado</span>
                )}
              </div>
              <button className={waConnected ? "btn danger" : "btn success"} onClick={() => setWaConnected(!waConnected)}>
                {waConnected ? "Desconectar" : "Conectar API"}
              </button>
            </div>
          </div>

          <div style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '14px', fontWeight: 700 }}>
            PERSONAL MÉDICO ASOCIADO
          </div>
          <table className="tbl">
            <thead><tr><th>Profesional</th><th>Especialidad</th><th>Registro Médico</th><th>Acción</th></tr></thead>
            <tbody>
              {profesionales.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td><td>{p.esp}</td><td>{p.rm}</td>
                  <td><button className="btn danger" onClick={() => removeProf(p.id)} style={{ padding: '2px 6px', fontSize: '.7rem' }}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn" onClick={addProf} style={{ marginTop: '10px' }}>+ Añadir Profesional</button>

        </div>
      </div>
    </div>
  );
};

export default Config;