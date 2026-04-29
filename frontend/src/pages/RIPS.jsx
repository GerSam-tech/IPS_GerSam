import GlobalVoiceBtn from '../components/GlobalVoiceBtn';
import { useState } from 'react';

// Catálogos MOCK para validación de Resolución 2275
const CATALOGOS = {
  codServicio: ['892', '893', '386', '387'],
  finalidadTecnologiaSalud: ['11', '12', '13', '14', '21', '22', '23', '24'],
  causaMotivoAtencion: ['26', '27', '28', '29', '30'],
  tipoDiagnosticoPrincipal: ['01', '02', '03']
};

const RIPS = ({ goTo }) => {
  const [formData, setFormData] = useState({
    nitPrestador: '900.123.456-7',
    codHabilitacion: '0500201234',
    periodo: '2025-04',
    modalidad: 'FFS – Pago por Evento',
    epsReportada: 'Sura EPS',
    tipoReporte: 'CT – Consulta',
    numFactura: 'FE-2025-0087'
  });

  const [ripsJson, setRipsJson] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Función interna de validación estricta (Res 2275)
  const validarRIPS = (jsonObj) => {
    const errores = [];

    // 1. Validar Transacción (FEV Relacionada)
    if (!jsonObj.transaccion) {
      errores.push({ campo: 'transaccion', error: 'Objeto transaccion es obligatorio', valor: null });
    } else {
      if (!jsonObj.transaccion.numDocumentoIdObligado) {
        errores.push({ campo: 'transaccion.numDocumentoIdObligado', error: 'NIT obligatorio', valor: null });
      }
      if (!jsonObj.transaccion.numFactura) {
        errores.push({ campo: 'transaccion.numFactura', error: 'N° Factura Electrónica (FEV) obligatorio', valor: null });
      }
    }

    // 2. Validar Usuarios
    if (!jsonObj.usuarios || !Array.isArray(jsonObj.usuarios) || jsonObj.usuarios.length === 0) {
      errores.push({ campo: 'usuarios', error: 'Arreglo de usuarios vacío o inexistente', valor: null });
    } else {
      jsonObj.usuarios.forEach((u, i) => {
        if (!u.tipoDocumentoIdentificacion) errores.push({ campo: `usuarios[${i}].tipoDocumentoIdentificacion`, error: 'Requerido', valor: null });
        if (!u.numDocumentoIdentificacion) errores.push({ campo: `usuarios[${i}].numDocumentoIdentificacion`, error: 'Requerido', valor: null });
        if (!u.tipoUsuario) errores.push({ campo: `usuarios[${i}].tipoUsuario`, error: 'Requerido', valor: null });
        if (!u.fechaNacimiento || isNaN(Date.parse(u.fechaNacimiento))) {
          errores.push({ campo: `usuarios[${i}].fechaNacimiento`, error: 'Formato de fecha inválido (AAAA-MM-DD)', valor: u.fechaNacimiento });
        }
        if (!u.codSexo) errores.push({ campo: `usuarios[${i}].codSexo`, error: 'Requerido', valor: null });
        if (!u.codMunicipioResidencia) errores.push({ campo: `usuarios[${i}].codMunicipioResidencia`, error: 'Requerido', valor: null });
        if (!u.codZonaTerritorialResidencia) errores.push({ campo: `usuarios[${i}].codZonaTerritorialResidencia`, error: 'Requerido', valor: null });
      });
    }

    // 3. Validar Consultas
    if (jsonObj.consultas && Array.isArray(jsonObj.consultas)) {
      jsonObj.consultas.forEach((c, i) => {
        // Validar contra catálogos
        if (!CATALOGOS.codServicio.includes(c.codServicio)) {
          errores.push({ campo: `consultas[${i}].codServicio`, error: 'Código no válido según catálogo', valor: c.codServicio });
        }
        if (!CATALOGOS.finalidadTecnologiaSalud.includes(c.finalidadTecnologiaSalud)) {
          errores.push({ campo: `consultas[${i}].finalidadTecnologiaSalud`, error: 'Código no válido según catálogo', valor: c.finalidadTecnologiaSalud });
        }
        if (!CATALOGOS.causaMotivoAtencion.includes(c.causaMotivoAtencion)) {
          errores.push({ campo: `consultas[${i}].causaMotivoAtencion`, error: 'Código no válido según catálogo', valor: c.causaMotivoAtencion });
        }

        // Validación de Diagnóstico Principal (Formato CIE-10)
        const cie10Regex = /^[A-Z][0-9]{2}[0-9A-Z]?$/;
        if (!c.codDiagnosticoPrincipal || !cie10Regex.test(c.codDiagnosticoPrincipal)) {
          errores.push({ campo: `consultas[${i}].codDiagnosticoPrincipal`, error: 'Formato CIE10 inválido', valor: c.codDiagnosticoPrincipal });
        }

        if (!CATALOGOS.tipoDiagnosticoPrincipal.includes(c.tipoDiagnosticoPrincipal)) {
          errores.push({ campo: `consultas[${i}].tipoDiagnosticoPrincipal`, error: 'Debe ser 01, 02 o 03', valor: c.tipoDiagnosticoPrincipal });
        }

        // Validaciones numéricas y lógicas
        if (typeof c.valorPagoModerador !== 'number' || c.valorPagoModerador < 0) {
          errores.push({ campo: `consultas[${i}].valorPagoModerador`, error: 'Debe ser numérico positivo o cero', valor: c.valorPagoModerador });
        }
        
        // Relación con FEV
        if (c.valorPagoModerador > 0 && (!c.numFEVPagoModerador || c.numFEVPagoModerador !== jsonObj.transaccion.numFactura)) {
          errores.push({ campo: `consultas[${i}].numFEVPagoModerador`, error: 'Inconsistencia con la factura transaccional asociada', valor: c.numFEVPagoModerador });
        }
      });
    }

    // 4. Asegurar existencia de matriz de procedimientos
    if (!jsonObj.procedimientos || !Array.isArray(jsonObj.procedimientos)) {
      errores.push({ campo: 'procedimientos', error: 'Debe existir un arreglo de procedimientos (puede estar vacío)', valor: null });
    }

    return {
      valido: errores.length === 0,
      errores
    };
  };

  const generarRIPS = () => {
    // 1. Construir objeto JSON según Resolución 2275 de 2023
    const jsonObj = {
      "transaccion": {
        "numDocumentoIdObligado": formData.nitPrestador.replace(/[^0-9]/g, ''),
        "numFactura": formData.numFactura,
        "tipoNota": null,
        "numNota": null
      },
      "usuarios": [
        {
          "tipoDocumentoIdentificacion": "CC",
          "numDocumentoIdentificacion": "1023456789",
          "tipoUsuario": "01",
          "fechaNacimiento": "1983-02-14",
          "codSexo": "F",
          "codPaisResidencia": "170",
          "codMunicipioResidencia": "05001",
          "codZonaTerritorialResidencia": "01",
          "incapacidad": "N",
          "consecutivo": 1,
          "codPaisOrigen": "170"
        }
      ],
      "consultas": formData.tipoReporte.includes('Consulta') ? [
        {
          "consecutivo": 1,
          "codigoPrestador": formData.codHabilitacion,
          "numDocumentoIdentificacion": "1023456789",
          "tipoDocumentoIdentificacion": "CC",
          "fechaInicioAtencion": "2025-04-10 08:00",
          "codConsulta": "894101",
          "modalidadGrupoServicioTecSal": "01",
          "grupoServicios": "01",
          "codServicio": "892",
          "finalidadTecnologiaSalud": "11",
          "causaMotivoAtencion": "26",
          "codDiagnosticoPrincipal": "H521",
          "codDiagnosticoRelacionado1": null,
          "codDiagnosticoRelacionado2": null,
          "codDiagnosticoRelacionado3": null,
          "tipoDiagnosticoPrincipal": "02",
          "valorConsulta": 50000,
          "valorPagoModerador": 0,
          "numFEVPagoModerador": formData.numFactura
        }
      ] : [],
      "procedimientos": formData.tipoReporte.includes('Procedimiento') ? [
        {
          "consecutivo": 1,
          "codigoPrestador": formData.codHabilitacion,
          "numDocumentoIdentificacion": "1023456789",
          "tipoDocumentoIdentificacion": "CC",
          "fechaInicioAtencion": "2025-04-10 08:30",
          "codProcedimiento": "950101",
          "viaIngresoServicioSalud": "02",
          "modalidadGrupoServicioTecSal": "01",
          "grupoServicios": "02",
          "codServicio": "892",
          "finalidadTecnologiaSalud": "11",
          "codDiagnosticoPrincipal": "H521",
          "valorProcedimiento": 0,
          "valorPagoModerador": 0,
          "numFEVPagoModerador": formData.numFactura
        }
      ] : []
    };
    
    // 2. Ejecutar validador estricto interno
    const resultadoValidacion = validarRIPS(jsonObj);
    
    if (!resultadoValidacion.valido) {
      setErroresValidacion(resultadoValidacion.errores);
      setRipsJson(JSON.stringify(jsonObj, null, 2)); // Mostrar el json aunque tenga errores para debug
      console.error("Errores de validación RIPS:", resultadoValidacion.errores);
    } else {
      setErroresValidacion([]);
      setRipsJson(JSON.stringify(jsonObj, null, 2));
    }
  };

  const enviarMINSALUD = () => {
    if (!ripsJson) {
      alert("⚠️ Genera el JSON primero.");
      return;
    }
    if (erroresValidacion.length > 0) {
      alert("❌ NO SE PUEDE ENVIAR. El archivo RIPS contiene errores de validación que causarán rechazo por el Ministerio de Salud.");
      return;
    }
    alert("✅ RIPS Validado localmente. Enviando a pasarela DIAN/MINSALUD...");
  };

  const descargarJSON = () => {
    if (!ripsJson) {
      alert('⚠️ Primero debes hacer clic en "Generar JSON" arriba para compilar los datos.');
      return;
    }
    const blob = new Blob([ripsJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RIPS_FEV_${formData.numFactura}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const descargarZIP = async () => {
    if (!ripsJson) {
      alert('⚠️ Primero debes hacer clic en "Generar JSON".');
      return;
    }
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      const fileName = `RIPS_FEV_${formData.numFactura}.json`;
      zip.file(fileName, ripsJson);
      
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Lote_RIPS_${formData.numFactura}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generando ZIP:', error);
      alert('Error al generar el ZIP.');
    }
  };

  const copiarRIPS = () => {
    if (ripsJson) {
      navigator.clipboard.writeText(ripsJson);
      alert('RIPS JSON copiado al portapapeles');
    }
  };

  const syntaxHighlight = (json) => {
    if (!json) return null;
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let color = 'var(--accent1)';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) { color = '#38bdf8'; } else { color = '#a3e635'; }
      } else if (/true|false/.test(match)) { color = '#c084fc'; } else if (/null/.test(match)) { color = '#fcd34d'; } else { color = '#fcd34d'; }
      return `<span style="color:${color}">${match}</span>`;
    });
  };

  return (
    <div className="section active">
      <div className="grid2">
        <div className="card">
          <div className="card-head">
            <div className="card-title">🗂️ Generador RIPS – Res. 2275 / 2023 (FEV-RIPS)</div>
            <GlobalVoiceBtn />
            <button className="btn primary" onClick={generarRIPS}>⚙️ Generar JSON</button>
          </div>
          <div className="card-body">
            <div className="form-grid g2" style={{ marginBottom: '14px' }}>
              <div className="field"><label>NIT Prestador</label><input type="text" name="nitPrestador" value={formData.nitPrestador} onChange={handleInputChange} /></div>
              <div className="field"><label>Código Habilitación REPS</label><input type="text" name="codHabilitacion" value={formData.codHabilitacion} onChange={handleInputChange} /></div>
              <div className="field"><label>N° Factura (FEV) Asociada</label><input type="text" name="numFactura" value={formData.numFactura} onChange={handleInputChange} /></div>
              <div className="field"><label>Período Facturación</label><input type="month" name="periodo" value={formData.periodo} onChange={handleInputChange} /></div>
              <div className="field"><label>Modalidad de Pago</label><select name="modalidad" value={formData.modalidad} onChange={handleInputChange}><option>FFS – Pago por Evento</option><option>Capitación</option><option>Global prospectivo</option></select></div>
              <div className="field"><label>EPS Reportada</label><select name="epsReportada" value={formData.epsReportada} onChange={handleInputChange}><option>Sura EPS</option><option>Nueva EPS</option><option>Compensar</option><option>Sanitas</option></select></div>
              <div className="field span2"><label>Tipo Reporte de Atención</label><select name="tipoReporte" value={formData.tipoReporte} onChange={handleInputChange}><option>CT – Consulta</option><option>AC – Procedimiento</option></select></div>
            </div>
            
            {erroresValidacion.length > 0 && (
              <div style={{ padding: '10px', background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '6px', marginBottom: '14px' }}>
                <div style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '.8rem', marginBottom: '6px' }}>❌ ERRORES DE VALIDACIÓN RESOLUCIÓN 2275</div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '.75rem', color: '#991b1b' }}>
                  {erroresValidacion.map((err, i) => (
                    <li key={i}><strong>{err.campo}:</strong> {err.error} (Valor: <em>{JSON.stringify(err.valor)}</em>)</li>
                  ))}
                </ul>
              </div>
            )}
            
            {ripsJson && erroresValidacion.length === 0 && (
               <div style={{ padding: '8px 10px', background: '#dcfce7', border: '1px solid #22c55e', borderRadius: '6px', marginBottom: '14px', fontSize: '.75rem', color: '#166534', fontWeight: 600 }}>
                 ✅ El JSON cumple con la estructura y los catálogos evaluados.
               </div>
            )}

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="btn success" onClick={descargarJSON}>📄 Descargar JSON</button>
              <button className={`btn ${erroresValidacion.length > 0 ? 'danger' : ''}`} onClick={enviarMINSALUD}>📡 Enviar a MINSALUD</button>
              <button className="btn" onClick={descargarZIP}>⬇️ Descargar ZIP (FEV-RIPS)</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">📋 Preview FEV-RIPS JSON (Soporte Factura)</div>
            <button className="btn" onClick={copiarRIPS} style={{ fontSize: '.72rem', padding: '4px 10px' }}>📋 Copiar</button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="code-block" style={{ margin: 0, borderRadius: 0, border: 'none', maxHeight: '520px', background: '#0f172a', padding: '16px', fontFamily: 'Courier New, monospace', fontSize: '.8rem', color: '#e2e8f0', overflowY: 'auto' }}>
              {ripsJson ? (
                <pre dangerouslySetInnerHTML={{ __html: syntaxHighlight(ripsJson) }} style={{ margin: 0, whiteSpace: 'pre-wrap' }}></pre>
              ) : (
                <span style={{ color: 'var(--text3)' }}>// Haga clic en "Generar JSON" para compilar y validar.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-head"><div className="card-title">📊 Historial de RIPS / FEV Enviados</div></div>
        <table className="tbl">
          <thead><tr><th>Período</th><th>EPS</th><th>N° Registros</th><th>Factura Asociada</th><th>Estado DIAN/MINSALUD</th><th>Fecha Envío</th><th>Acciones</th></tr></thead>
          <tbody>
            <tr>
              <td>Mar 2025</td><td>Sura EPS</td><td>47</td><td>FE-2025-0086</td>
              <td><span className="pill pill-done">Validado Exitoso</span></td><td>01 Abr 2025</td>
              <td><button className="btn" style={{ padding: '3px 8px', fontSize: '.7rem' }}>Ver JSON</button></td>
            </tr>
            <tr>
              <td>Feb 2025</td><td>Compensar</td><td>31</td><td>FE-2025-0042</td>
              <td><span className="pill pill-done">Validado Exitoso</span></td><td>01 Mar 2025</td>
              <td><button className="btn" style={{ padding: '3px 8px', fontSize: '.7rem' }}>Ver JSON</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RIPS;