import { useState, useRef } from 'react';
import GlobalVoiceBtn from '../components/GlobalVoiceBtn';

const Registro = ({ goTo }) => {
  const [formData, setFormData] = useState({
    tipoDoc: 'CC – Cédula', doc: '', docFecha: '',
    primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
    fnac: '', edad: '', sexo: 'Femenino',
    grupoSang: 'O+', etnia: 'Ninguna', estadoCivil: 'Soltero/a',
    celular: '', fijo: '', correo: '',
    departamento: 'Antioquia', municipio: '', barrio: '', direccion: '',
    regimen: 'Contributivo', eps: 'Sura EPS', poliza: '', sisben: 'No aplica',
    ocupacion: '', empresa: '',
    contactoNombre: '', contactoParentesco: '', contactoTel: '', contactoObs: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-calcular edad si se cambia la fecha de nacimiento
    if (name === 'fnac') {
      const diff = Date.now() - new Date(value).getTime();
      const edad = Math.floor(diff / 31557600000);
      setFormData(prev => ({ ...prev, fnac: value, edad: isNaN(edad) ? '' : `${edad} años` }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const guardarPaciente = () => {
    // Aquí iría la lógica de guardado (API o context)
    alert(`Paciente ${formData.primerNombre} ${formData.primerApellido} registrado exitosamente.`);
    goTo('dashboard');
  };

  return (
    <div className="section active">
      <div className="card">
        <div className="card-head">
          <div className="card-title">👤 Registro de Paciente – Proceso CIE-10</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <GlobalVoiceBtn />
            <button className="btn primary" onClick={guardarPaciente}>💾 Guardar Paciente</button>
          </div>
        </div>

        {/* IDENTIFICACIÓN */}
        <div className="photo-reg-container" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div className="photo-zone" onClick={handlePhotoClick}>
              {photoPreview ? (
                <img src={photoPreview} alt="Paciente" />
              ) : (
                <div style={{ textAlign: 'center' }}>📷<div style={{ fontSize: '.6rem', marginTop: '4px' }}>Foto</div></div>
              )}
            </div>
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            <div style={{ fontSize: '.6rem', color: 'var(--text3)' }}>Click para subir</div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '.65rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '10px', fontWeight: 700 }}>
              DATOS DE IDENTIFICACIÓN
            </div>
            <div className="form-grid g3" style={{ gap: '10px' }}>
              <div className="field">
                <label>Tipo Documento</label>
                <select name="tipoDoc" value={formData.tipoDoc} onChange={handleInputChange}>
                  <option>CC – Cédula</option><option>TI – Tarjeta Identidad</option>
                  <option>CE – Cédula Extranjería</option><option>PA – Pasaporte</option>
                  <option>RC – Reg. Civil</option><option>NUI</option>
                </select>
              </div>
              <div className="field"><label>N° Documento</label><input type="text" name="doc" value={formData.doc} onChange={handleInputChange} /></div>
              <div className="field"><label>Fecha Expedición</label><input type="date" name="docFecha" value={formData.docFecha} onChange={handleInputChange} /></div>
              <div className="field"><label>Primer Nombre</label><input type="text" name="primerNombre" value={formData.primerNombre} onChange={handleInputChange} /></div>
              <div className="field"><label>Segundo Nombre</label><input type="text" name="segundoNombre" value={formData.segundoNombre} onChange={handleInputChange} /></div>
              <div className="field"><label>Primer Apellido</label><input type="text" name="primerApellido" value={formData.primerApellido} onChange={handleInputChange} /></div>
              <div className="field"><label>Segundo Apellido</label><input type="text" name="segundoApellido" value={formData.segundoApellido} onChange={handleInputChange} /></div>
              <div className="field"><label>Fecha Nacimiento</label><input type="date" name="fnac" value={formData.fnac} onChange={handleInputChange} /></div>
              <div className="field"><label>Edad</label><input type="text" value={formData.edad} placeholder="Auto" readOnly style={{ color: 'var(--accent3)' }} /></div>
              <div className="field">
                <label>Sexo</label>
                <select name="sexo" value={formData.sexo} onChange={handleInputChange}>
                  <option>Femenino</option><option>Masculino</option><option>No binario</option>
                </select>
              </div>
              <div className="field">
                <label>Grupo Sanguíneo</label>
                <select name="grupoSang" value={formData.grupoSang} onChange={handleInputChange}>
                  <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                  <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                </select>
              </div>
              <div className="field">
                <label>Etnia</label>
                <select name="etnia" value={formData.etnia} onChange={handleInputChange}>
                  <option>Ninguna</option><option>Indígena</option><option>Afrocolombiano</option>
                  <option>Raizal</option><option>Palenquero</option><option>ROM/Gitano</option>
                </select>
              </div>
              <div className="field">
                <label>Estado Civil</label>
                <select name="estadoCivil" value={formData.estadoCivil} onChange={handleInputChange}>
                  <option>Soltero/a</option><option>Casado/a</option><option>Unión libre</option>
                  <option>Divorciado/a</option><option>Viudo/a</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACTO */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '.65rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '10px', fontWeight: 700 }}>
            CONTACTO Y UBICACIÓN
          </div>
          <div className="form-grid g3">
            <div className="field"><label>Celular / WhatsApp</label><input type="tel" name="celular" value={formData.celular} onChange={handleInputChange} placeholder="+57 300 000 0000" /></div>
            <div className="field"><label>Teléfono Fijo</label><input type="tel" name="fijo" value={formData.fijo} onChange={handleInputChange} /></div>
            <div className="field"><label>Correo Electrónico</label><input type="email" name="correo" value={formData.correo} onChange={handleInputChange} /></div>
            <div className="field">
              <label>Departamento</label>
              <select name="departamento" value={formData.departamento} onChange={handleInputChange}>
                <option>Antioquia</option><option>Bogotá D.C.</option><option>Valle del Cauca</option>
                <option>Cundinamarca</option><option>Otro</option>
              </select>
            </div>
            <div className="field"><label>Municipio</label><input type="text" name="municipio" value={formData.municipio} onChange={handleInputChange} placeholder="Medellín" /></div>
            <div className="field"><label>Barrio</label><input type="text" name="barrio" value={formData.barrio} onChange={handleInputChange} /></div>
            <div className="field span3"><label>Dirección</label><input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Calle, Carrera, N°, Apto…" /></div>
          </div>
        </div>

        {/* SGSSS */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '.65rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '10px', fontWeight: 700 }}>
            ASEGURAMIENTO – SGSSS
          </div>
          <div className="form-grid g3">
            <div className="field">
              <label>Tipo de Afiliación</label>
              <select name="regimen" value={formData.regimen} onChange={handleInputChange}>
                <option>Contributivo</option><option>Subsidiado</option><option>Particular</option>
                <option>ARL</option><option>SOAT</option><option>Medicina Prepagada</option><option>Sin afiliación</option>
              </select>
            </div>
            <div className="field">
              <label>EPS / Aseguradora</label>
              <select name="eps" value={formData.eps} onChange={handleInputChange}>
                <option>Sura EPS</option><option>Nueva EPS</option><option>Compensar</option>
                <option>Sanitas</option><option>Coomeva</option><option>Salud Total</option>
                <option>Medimás</option><option>Particular</option>
              </select>
            </div>
            <div className="field"><label>N° Póliza / Carné</label><input type="text" name="poliza" value={formData.poliza} onChange={handleInputChange} /></div>
            <div className="field">
              <label>Nivel SISBEN</label>
              <select name="sisben" value={formData.sisben} onChange={handleInputChange}>
                <option>No aplica</option><option>A</option><option>B</option><option>C</option><option>D</option>
              </select>
            </div>
            <div className="field"><label>Ocupación</label><input type="text" name="ocupacion" value={formData.ocupacion} onChange={handleInputChange} /></div>
            <div className="field"><label>Empresa Empleadora</label><input type="text" name="empresa" value={formData.empresa} onChange={handleInputChange} /></div>
          </div>
        </div>

        {/* EMERGENCIA */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '.65rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--accent3)', marginBottom: '10px', fontWeight: 700 }}>
            CONTACTO DE EMERGENCIA
          </div>
          <div className="form-grid g3">
            <div className="field span2"><label>Nombre Contacto</label><input type="text" name="contactoNombre" value={formData.contactoNombre} onChange={handleInputChange} /></div>
            <div className="field"><label>Parentesco</label><input type="text" name="contactoParentesco" value={formData.contactoParentesco} onChange={handleInputChange} /></div>
            <div className="field"><label>Teléfono Emergencia</label><input type="tel" name="contactoTel" value={formData.contactoTel} onChange={handleInputChange} /></div>
            <div className="field span2"><label>Observaciones Generales</label><input type="text" name="contactoObs" value={formData.contactoObs} onChange={handleInputChange} /></div>
          </div>
          <div style={{ fontSize: '.65rem', color: 'var(--text3)', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🔊 Haga clic en 🎙️ para dictar datos por voz
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
