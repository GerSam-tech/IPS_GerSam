// ─── INIT ───────────────────────────────────────────────────────────────────
const now = new Date();
document.getElementById('rda-fecha').value = now.toISOString().split('T')[0];
document.getElementById('rda-hora').value = now.toTimeString().slice(0,5);
document.getElementById('rda-num').value = 'OFT-' + String(Math.floor(Math.random()*90000)+10000);
document.getElementById('dian-fecha').value = now.toISOString().split('T')[0];
const hcFH = document.getElementById('hc-fecha-hora');
if(hcFH) hcFH.textContent = now.toLocaleString('es-CO',{dateStyle:'medium',timeStyle:'short'});

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
let sbCollapsed = false;
function toggleSidebar(){
  sbCollapsed = !sbCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.getElementById('sidebar').classList.toggle('open');
  const tog = document.querySelector('.sidebar-toggle');
  if (tog) tog.textContent = sbCollapsed ? '▶' : '◀';
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
const sectionTitles = {
  dashboard:'Panel de Control',agenda:'Agendamiento – Google Calendar',
  registro:'Registro de Paciente (CIE-10)',hc:'Historia Clínica',
  rda:'RDA – Registro Diario de Atención',rips:'RIPS / FEV-RIPS JSON',
  dian:'Facturación Electrónica DIAN',inventario:'Gestión de Inventario',
  notificaciones:'Notificaciones WhatsApp Business',reportes:'Reportes y Estadísticas',
  config:'Configuración del Sistema'
};
function goTo(id, navEl){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById('sec-'+id).classList.add('active');
  document.getElementById('tb-title').textContent = sectionTitles[id]||id;
  if(navEl){
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    navEl.classList.add('active');
  }
  // On mobile, auto-close sidebar on page switch
  if(window.innerWidth <= 768){
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('collapsed');
    sidebar.classList.remove('open');
    sbCollapsed = true;
    const tog = document.querySelector('.sidebar-toggle');
    if (tog) tog.textContent = '▶';
  }
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
function switchTab(tabEl, contentId){
  const row = tabEl.closest('.tab-row');
  row.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  tabEl.classList.add('active');
  const card = row.closest('.card')||row.parentElement;
  card.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('show'));
  const tc = document.getElementById(contentId);
  if(tc) tc.classList.add('show');
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg, type='info'){
  const wrap = document.getElementById('toast-wrap');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  const icon = type==='success'?'✓':type==='warning'?'⚠️':type==='error'?'✕':'ℹ️';
  t.innerHTML = '<span>'+icon+'</span><span>'+msg+'</span>';
  wrap.appendChild(t);
  setTimeout(()=>{t.style.animation='slideIn .3s reverse';setTimeout(()=>t.remove(),280)},3500);
}

// ─── CALENDAR ─────────────────────────────────────────────────────────────────
let calYear = now.getFullYear(), calMonth = now.getMonth();
const busyDays = [3,7,8,14,15,21,22];
const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
function renderCal(){
  const grid = document.getElementById('cal-grid');
  const label = document.getElementById('cal-month-label');
  label.textContent = months[calMonth]+' '+calYear;
  const first = new Date(calYear,calMonth,1).getDay();
  const days = new Date(calYear,calMonth+1,0).getDate();
  let html='';
  for(let i=0;i<first;i++) html+='<div class="cal-day empty"></div>';
  for(let d=1;d<=days;d++){
    const isToday = d===now.getDate()&&calMonth===now.getMonth()&&calYear===now.getFullYear();
    const isBusy = busyDays.includes(d);
    const cls = isToday?'today':isBusy?'busy':'available';
    html+=`<div class="cal-day ${cls}" onclick="selectDay(${d})">${d}${isBusy?'':'<div class="cal-dot"></div>'}</div>`;
  }
  grid.innerHTML=html;
}
function calNav(dir){calMonth+=dir;if(calMonth<0){calMonth=11;calYear--;}if(calMonth>11){calMonth=0;calYear++;}renderCal();}
function selectDay(d){
  document.querySelectorAll('.cal-day').forEach(el=>el.classList.remove('selected'));
  const all=document.querySelectorAll('.cal-day:not(.empty)');
  all.forEach(el=>{if(parseInt(el.textContent)===d)el.classList.add('selected')});
  document.getElementById('selected-date-label').textContent = d+' de '+months[calMonth]+' '+calYear;
  renderSlots(d);
}
const slotData = {
  free:['08:00','08:30','09:30','10:00','10:30','11:30','14:00','14:30','15:00','15:30','16:00','16:30'],
  taken:['09:00','11:00','13:00','13:30']
};
function renderSlots(d){
  if(busyDays.includes(d)){document.getElementById('slots-grid').innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--red);padding:16px;font-size:.8rem">🔴 Día completo – sin disponibilidad</div>';document.getElementById('agenda-form').style.display='none';return;}
  const allSlots=[...slotData.free,...slotData.taken].sort();
  document.getElementById('slots-grid').innerHTML=allSlots.map(s=>{
    const isFree=slotData.free.includes(s);
    return `<div class="slot ${isFree?'free':'taken'}" onclick="${isFree?`selectSlot(this,'${s}')`:'void 0'}">${s}</div>`;
  }).join('');
}
function selectSlot(el,s){
  document.querySelectorAll('.slot').forEach(x=>x.classList.remove('selected-slot'));
  el.classList.add('selected-slot');
  document.getElementById('agenda-form').style.display='block';
  showToast('Horario '+s+' seleccionado','info');
}
renderCal();

// ─── PATIENTS DATA ────────────────────────────────────────────────────────────
const patients=[
  {init:'MR',av:'av1',name:'María Rodríguez',hora:'08:00',dx:'H52.1 Miopía bilateral',prof:'A. Salcedo',status:'completado',phone:'+573124567890'},
  {init:'CJ',av:'av2',name:'Carlos Jiménez',hora:'08:45',dx:'H52.4 Presbicia',prof:'A. Salcedo',status:'completado',phone:'+573219876543'},
  {init:'LF',av:'av3',name:'Luisa Fernanda Arias',hora:'09:30',dx:'H52.2 Astigmatismo',prof:'H. Monsalve',status:'en proceso',phone:'+573001112233'},
  {init:'JR',av:'av4',name:'Jorge Ramírez',hora:'10:15',dx:'H40.1 Sospecha glaucoma',prof:'H. Monsalve',status:'pendiente',phone:'+573157778899'},
  {init:'VC',av:'av5',name:'Valentina Castro',hora:'11:00',dx:'H52.0 Hipermetropía',prof:'A. Salcedo',status:'pendiente',phone:'+573043334455'},
];
function spClass(s){return s==='completado'?'pill-done':s==='en proceso'?'pill-prog':s==='cancelado'?'pill-canc':'pill-pend';}
function renderDash(){
  document.getElementById('dash-tbody').innerHTML=patients.map(p=>`
    <tr>
      <td><div style="display:flex;align-items:center;gap:8px"><div class="av ${p.av}">${p.init}</div><span>${p.name}</span></div></td>
      <td style="color:var(--accent3)">${p.hora}</td>
      <td style="color:var(--text3);font-size:.75rem">${p.dx}</td>
      <td>${p.prof}</td>
      <td><span class="pill ${spClass(p.status)}">${p.status}</span></td>
      <td style="display:flex;gap:4px;flex-wrap:wrap">
        <button class="btn" style="padding:3px 7px;font-size:.68rem" onclick="goTo('hc',null)">HC</button>
        <button class="btn" style="padding:3px 7px;font-size:.68rem" onclick="goTo('rda',null)">RDA</button>
        <button class="btn wa" style="padding:3px 7px;font-size:.68rem" onclick="quickWA('${p.name}','${p.phone}')">WA</button>
      </td>
    </tr>`).join('');
  document.getElementById('citas-tbody').innerHTML=patients.map(p=>`
    <tr>
      <td style="color:var(--accent3)">${p.hora}</td>
      <td><div style="display:flex;align-items:center;gap:6px"><div class="av ${p.av}" style="width:24px;height:24px;font-size:.6rem">${p.init}</div>${p.name}</div></td>
      <td>Optometría</td>
      <td>${p.prof}</td>
      <td><span class="pill ${spClass(p.status)}">${p.status}</span></td>
      <td><button class="btn wa" style="padding:2px 7px;font-size:.68rem" onclick="quickWA('${p.name}','${p.phone}')">📲</button></td>
    </tr>`).join('');
  document.getElementById('wa-tbody').innerHTML=patients.map(p=>`
    <tr>
      <td><div style="display:flex;align-items:center;gap:6px"><div class="av ${p.av}" style="width:24px;height:24px;font-size:.6rem">${p.init}</div>${p.name}</div></td>
      <td style="font-size:.75rem;color:var(--text3)">${p.phone}</td>
      <td>Receta lista</td>
      <td><span class="pill ${p.status==='completado'?'pill-done':'pill-pend'}">${p.status==='completado'?'Enviado':'Pendiente'}</span></td>
      <td><button class="btn wa" style="padding:3px 8px;font-size:.7rem" onclick="quickWA('${p.name}','${p.phone}')">Enviar WA</button></td>
    </tr>`).join('');
}
renderDash();

// ─── INVENTORY ────────────────────────────────────────────────────────────────
const inventory=[
  {cod:'INV-001',name:'Lentes monofocales CR39',cat:'Lentes ópticos',stock:142,min:20,val:'$18.000',ok:true},
  {cod:'INV-002',name:'Lentes progresivos',cat:'Lentes ópticos',stock:67,min:10,val:'$85.000',ok:true},
  {cod:'INV-003',name:'Gotas lubricantes Optive',cat:'Medicamentos',stock:18,min:30,val:'$24.000',ok:false},
  {cod:'INV-004',name:'Tropicamida 1% gotas',cat:'Medicamentos',stock:4,min:20,val:'$12.000',ok:false},
  {cod:'INV-005',name:'Fenilefrina 2.5%',cat:'Medicamentos',stock:7,min:15,val:'$14.000',ok:false},
  {cod:'INV-006',name:'Estuche para gafas',cat:'Accesorios',stock:230,min:50,val:'$4.500',ok:true},
  {cod:'INV-007',name:'Solución limpiadora LC',cat:'Insumos',stock:12,min:25,val:'$32.000',ok:false},
];
function renderInv(){
  document.getElementById('inv-tbody').innerHTML=inventory.map(i=>`
    <tr>
      <td style="color:var(--accent3);font-size:.75rem">${i.cod}</td>
      <td>${i.name}</td>
      <td style="color:var(--text3);font-size:.75rem">${i.cat}</td>
      <td style="color:${i.ok?'var(--green)':'var(--red)'};font-weight:700">${i.stock}</td>
      <td style="color:var(--text3)">${i.min}</td>
      <td>${i.val}</td>
      <td><span class="pill ${i.ok?'pill-done':'pill-canc'}">${i.ok?'OK':'Crítico'}</span></td>
      <td style="display:flex;gap:3px"><button class="btn" style="padding:2px 6px;font-size:.68rem" onclick="showToast('Editando '+this.closest('tr').cells[1].textContent,'info')">✏️</button><button class="btn success" style="padding:2px 6px;font-size:.68rem" onclick="showToast('Orden de compra creada','success')">🛒</button></td>
    </tr>`).join('');
  document.getElementById('inv-alertas').innerHTML=inventory.filter(i=>!i.ok).map(i=>`
    <div style="display:flex;align-items:center;gap:8px;padding:8px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.2);border-radius:6px">
      <span style="font-size:.85rem">⚠️</span>
      <div style="flex:1"><div style="font-size:.78rem;font-weight:600;color:var(--text)">${i.name}</div><div style="font-size:.68rem;color:var(--red)">Stock: ${i.stock} / Mínimo: ${i.min}</div></div>
      <button class="btn danger" style="padding:3px 8px;font-size:.7rem" onclick="showToast('Orden de compra generada para '+\`${i.name}\`,'success')">Pedir</button>
    </div>`).join('');
}
renderInv();

// ─── SÍNTOMAS / CIE-10 ───────────────────────────────────────────────────────
const sintomas=['Disminución AV','Visión borrosa','Fotofobia','Diplopía','Cefalea','Ojo rojo','Secretas/Legañas','Ardor/Prurito','Cuerpo extraño','Halos/Destellos','Moscas volantes','Pérdida campo visual','Dolor ocular','Lagrimeo','Miopía progresiva','Dificultad visión cercana'];
document.getElementById('sintomas-grid').innerHTML=sintomas.map(s=>`
  <label style="display:flex;align-items:center;gap:6px;padding:6px 8px;border:1px solid var(--border);border-radius:5px;cursor:pointer;font-size:.75rem;transition:all .15s" onmouseover="this.style.borderColor='var(--accent1)'" onmouseout="this.style.borderColor='var(--border)'">
    <input type="checkbox" style="accent-color:var(--accent1)"> ${s}
  </label>`).join('');

const cie10=[
  {c:'H52.1',d:'Miopía'},{c:'H52.2',d:'Astigmatismo'},{c:'H52.0',d:'Hipermetropía'},
  {c:'H52.4',d:'Presbicia'},{c:'H10',d:'Conjuntivitis'},{c:'H26',d:'Catarata'},
  {c:'H40',d:'Glaucoma'},{c:'H35.3',d:'DMRE'},{c:'H04.1',d:'Ojo seco'},
  {c:'H18.6',d:'Queratocono'},{c:'H50',d:'Estrabismo'},{c:'H53.2',d:'Diplopía'}
];
document.getElementById('cie10-pills').innerHTML=cie10.map(x=>`
  <span onclick="toggleCIE(this,'${x.c}','${x.d}')" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:.72rem;font-weight:600;cursor:pointer;border:1px solid var(--border);background:var(--bg3);color:var(--text3);transition:all .15s;margin:2px">
    ${x.c} ${x.d}
  </span>`).join('');
const activeDX=new Set();
function toggleCIE(el,code,desc){
  if(activeDX.has(code)){activeDX.delete(code);el.style.background='var(--bg3)';el.style.color='var(--text3)';el.style.borderColor='var(--border)';}
  else{activeDX.add(code);el.style.background='rgba(0,180,216,.15)';el.style.color='var(--accent1)';el.style.borderColor='var(--accent1)';}
  const dxF=document.getElementById('dx-field');
  dxF.value=[...activeDX].map(c=>{const found=cie10.find(x=>x.c===c);return c+(found?' – '+found.d:'');}).join('\n');
}

// ─── VOICE ────────────────────────────────────────────────────────────────────
let recognition=null,voiceTarget='';
function toggleVoice(target){
  voiceTarget=target;
  document.getElementById('modal-voz').classList.add('show');
  startSpeech();
}
function showVoice(){toggleVoice('hc-motivo');}
function startSpeech(){
  if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){
    document.getElementById('voice-transcript').textContent='⚠️ Reconocimiento de voz no disponible en este navegador. Use Chrome.';return;
  }
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  recognition=new SR();recognition.lang='es-CO';recognition.continuous=true;recognition.interimResults=true;
  recognition.onresult=function(e){
    let interim='',final='';
    for(let i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal)final+=e.results[i][0].transcript;else interim+=e.results[i][0].transcript;}
    document.getElementById('voice-transcript').textContent=(final||interim)||'Escuchando…';
    if(final){const f=document.getElementById('hc-motivo');if(f)f.value+=(f.value?' ':'')+final;}
  };
  recognition.onerror=function(e){document.getElementById('voice-transcript').textContent='Error: '+e.error;};
  recognition.start();
}
function stopVoice(){if(recognition)recognition.stop();closeModalVoz();showToast('Dictado guardado en el campo activo','success');}
function closeModalVoz(){document.getElementById('modal-voz').classList.remove('show');}
document.getElementById('voice-reg-status') && (document.getElementById('voice-reg-status').textContent='Haga clic en 🎙️ para dictar datos del paciente por voz');

// ─── PHOTO ────────────────────────────────────────────────────────────────────
function previewPhoto(input){
  if(!input.files||!input.files[0])return;
  const reader=new FileReader();
  reader.onload=function(e){
    const zone=document.getElementById('photoZone');
    zone.innerHTML=`<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover">`;
    const hcPrev=document.getElementById('hc-photo-preview');
    if(hcPrev)hcPrev.innerHTML=`<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover">`;
    showToast('Foto del paciente cargada exitosamente','success');
  };
  reader.readAsDataURL(input.files[0]);
}

// ─── RIPS JSON ────────────────────────────────────────────────────────────────
function generarRIPS(){
  const rips={
    "$schema":"https://minsalud.gov.co/schemas/rips/v2.0",
    "numDocumentIdObligado":"900.123.456-7",
    "numFactura":"FE-2025-0087",
    "tipoNota":null,
    "numNota":null,
    "listaPrestacionesServiciosSalud":[{
      "codigoEntidadAdministradoraRiesgo":"EPS010",
      "tipoDocumentoIdentificacion":"CC",
      "numDocumentoIdentificacion":"1023456789",
      "tipoUsuario":"01",
      "fechaNacimiento":"1983-02-14",
      "codSexo":"F",
      "codPaisResidencia":"170",
      "codMunicipioResidencia":"05001",
      "codZonaTerritorialResidencia":"1",
      "incapacidad":"N",
      "codPaisOrigen":"170",
      "consultas":[{
        "codConsulta":"894101",
        "modalidadGrupoServicioTecSal":"01",
        "grupoServicios":"01",
        "codServicio":"892",
        "finalidadTecnologiaSalud":"11",
        "causaMotivoAtencion":"26",
        "codDiagnosticoPrincipal":"H521",
        "codDiagnosticoCausaMuerte":null,
        "tipoDiagnosticoPrincipal":"02",
        "numDiagnosticosAdicionales":0,
        "valorPagoModerador":0,
        "numFEVPagoModerador":null,
        "consecutivo":1
      }]
    }]
  };
  const pre=document.getElementById('rips-json-preview');
  pre.innerHTML=syntaxHighlight(JSON.stringify(rips,null,2));
  goTo('rips',null);
  showToast('RIPS JSON generado según Resolución 2275/2023','success');
}
function syntaxHighlight(json){
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,function(match){
    let cls='num';
    if(/^"/.test(match)){cls=/:$/.test(match)?'key':'str';}
    else if(/true|false/.test(match)){cls='bool';}
    else if(/null/.test(match)){cls='num';}
    return '<span class="'+cls+'">'+match+'</span>';
  });
}
function copyRIPS(){navigator.clipboard.writeText(document.getElementById('rips-json-preview').innerText).then(()=>showToast('RIPS JSON copiado al portapapeles','success'));}

// ─── DIAN ─────────────────────────────────────────────────────────────────────
function validarDIAN(){showToast('Validando datos con la DIAN…','info');setTimeout(()=>showToast('Datos válidos – listo para emitir','success'),1800);}
function emitirDIAN(){
  showToast('Enviando factura electrónica a la DIAN…','info');
  setTimeout(()=>{
    const cufe='b3f9a2c1d4e5f67890ab12cd34ef5678901234567890abcdef1234567890ab12cd34ef56789012345678901234567890abcdef1234567890ab12c3d4e5f6';
    document.getElementById('cufe-box').textContent='CUFE: '+cufe;
    document.querySelectorAll('.dian-step').forEach((s,i)=>{s.classList.add('done');s.querySelector('.dian-num').textContent='✓';s.style.opacity='1';});
    showToast('✓ Factura FE-2025-0087 aceptada por la DIAN','success');
  },2200);
}
function addDianItem(){
  const tbody=document.getElementById('dian-items-body');
  const tr=document.createElement('tr');
  tr.innerHTML='<td><input style="background:transparent;border:none;color:var(--accent3);width:80px" placeholder="CUPS"></td><td><input style="background:transparent;border:none;color:var(--text);width:100%"></td><td><input style="background:transparent;border:none;color:var(--text);width:40px" value="1"></td><td><input style="background:transparent;border:none;color:var(--text);width:80px" placeholder="$0"></td><td>0%</td><td style="color:var(--accent3)">$0</td><td><button onclick="this.closest(\'tr\').remove()" style="background:none;border:none;color:var(--red);cursor:pointer">✕</button></td>';
  tbody.appendChild(tr);
}

// ─── WA ───────────────────────────────────────────────────────────────────────
const waMsgs={
  receta:'Hola {nombre} 👋, su *receta óptica* está lista para retirar en Gersam Axis IPS. 📋\n\nHorario: Lun–Sáb 8am–6pm\n_Clínica Gersam Axis_',
  cita:'Hola {nombre} 😊, tiene una *cita programada* con nosotros en Gersam Axis IPS. 📅\nConfirme respondiendo SÍ.\n_Clínica Gersam Axis_',
  resultado:'Hola {nombre}, sus *resultados de examen* están disponibles en Gersam Axis IPS. 🔬\n_Clínica Gersam Axis_',
  control:'Hola {nombre} 👁️, es momento de su *control oftalmológico* en Gersam Axis. Agende pronto su cita. 📞\n_Clínica Gersam Axis_',
  lentes:'Hola {nombre} 👓, sus *lentes ópticos* están listos en Gersam Axis IPS. ¡Le esperamos!\n_Clínica Gersam Axis_',
  personalizado:'Hola {nombre},\n\n[Escriba aquí su mensaje personalizado]\n\n_Clínica Gersam Axis_'
};
function updateWAPreview(){
  const tipo=document.getElementById('wa-template').value;
  const nombre=document.getElementById('wa-dest-nombre').value||'Paciente';
  document.getElementById('wa-preview-msg').textContent=waMsgs[tipo].replace(/\{nombre\}/g,nombre);
}
document.getElementById('wa-template').addEventListener('change',updateWAPreview);
document.getElementById('wa-dest-nombre').addEventListener('input',updateWAPreview);
updateWAPreview();
function sendWA(){
  const phone=(document.getElementById('wa-dest-phone').value||'').replace(/\D/g,'');
  if(!phone){showToast('Ingrese un número de WhatsApp','warning');return;}
  const msg=encodeURIComponent(document.getElementById('wa-preview-msg').textContent);
  window.open('https://wa.me/'+phone+'?text='+msg,'_blank');
  showToast('Abriendo WhatsApp Business…','success');
}
function copyWAMsg(){navigator.clipboard.writeText(document.getElementById('wa-preview-msg').textContent).then(()=>showToast('Mensaje copiado','success'));}
function quickWA(nombre,phone){
  goTo('notificaciones',null);
  document.getElementById('wa-dest-nombre').value=nombre;
  document.getElementById('wa-dest-phone').value=phone;
  updateWAPreview();
  showToast('Paciente '+nombre+' listo para notificación','info');
}
function notifWA(){goTo('notificaciones',null);}

// ─── MISC ─────────────────────────────────────────────────────────────────────
function guardarPaciente(){showToast('Paciente registrado exitosamente en el sistema','success');}
function confirmarCita(){showToast('Cita confirmada y agregada al calendario','success');}
function exportCal(){
  const d=document.getElementById('selected-date-label').textContent;
  showToast('Evento creado en Google Calendar: '+d,'success');
}
function globalSearch(v){if(v.length>2)showToast('Buscando: "'+v+'"…','info');}
function calcEdad(){
  const fn=document.getElementById('reg-fnac').value;
  if(!fn)return;
  const diff=Date.now()-new Date(fn);
  document.getElementById('reg-edad').value=Math.floor(diff/31557600000)+' años';
}
function showModalInventario(){document.getElementById('modal-inventario').classList.add('show');}
function closeModalInv(){document.getElementById('modal-inventario').classList.remove('show');}
function guardarInv(){showToast('Producto agregado al inventario','success');closeModalInv();}
document.getElementById('modal-inventario').addEventListener('click',function(e){if(e.target===this)closeModalInv();});
document.getElementById('modal-voz').addEventListener('click',function(e){if(e.target===this)closeModalVoz();});