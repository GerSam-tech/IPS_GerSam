import GlobalVoiceBtn from '../components/GlobalVoiceBtn';
import { useState } from 'react';
import { inventory } from '../data/mockData';

const Inventario = () => {
  const [items, setItems] = useState(inventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', cat: 'Lentes ópticos', stock: 10, min: 5, val: '' });

  const addStock = (cod) => setItems(prev => prev.map(i => i.cod === cod ? { ...i, stock: Number(i.stock) + 1 } : i));
  const subStock = (cod) => setItems(prev => prev.map(i => i.cod === cod ? { ...i, stock: Math.max(0, Number(i.stock) - 1) } : i));
  const editItem = (cod) => {
    const item = items.find(i => i.cod === cod);
    const newVal = prompt(`Actualizar precio para ${item.name} (ej. $25.000):`, item.val);
    if(newVal) setItems(prev => prev.map(i => i.cod === cod ? { ...i, val: newVal } : i));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const guardarNuevoProducto = () => {
    if (!formData.name || !formData.val) {
      alert("Por favor completa el nombre y el precio del producto.");
      return;
    }
    const nuevo = { 
      cod: `INV-00${items.length + 1}`, 
      name: formData.name, 
      cat: formData.cat, 
      stock: Number(formData.stock), 
      min: Number(formData.min), 
      val: formData.val, 
      ok: true 
    };
    setItems([nuevo, ...items]);
    setShowForm(false);
    setFormData({ name: '', cat: 'Lentes ópticos', stock: 10, min: 5, val: '' });
    alert("Producto agregado correctamente.");
  };

  const filtered = items.filter(i => (i.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="section active">
      <div className="card">
        <div className="card-head">
          <div className="card-title">📦 Gestión de Inventario Óptico</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <GlobalVoiceBtn />
            {showForm ? (
              <button className="btn danger" onClick={() => setShowForm(false)}>✕ Cancelar</button>
            ) : (
              <button className="btn primary" onClick={() => setShowForm(true)}>+ Nuevo Producto</button>
            )}
          </div>
        </div>
        <div className="card-body">
          {showForm && (
            <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--accent1)', marginBottom: '14px', textTransform: 'uppercase' }}>CREAR NUEVO PRODUCTO EN INVENTARIO</div>
              <div className="form-grid g3">
                <div className="field span2"><label>Nombre del Producto / Referencia</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej. Lentes Transitions G8..." /></div>
                <div className="field"><label>Categoría</label>
                  <select name="cat" value={formData.cat} onChange={handleInputChange}>
                    <option>Lentes ópticos</option>
                    <option>Monturas</option>
                    <option>Medicamentos</option>
                    <option>Soluciones</option>
                    <option>Accesorios</option>
                  </select>
                </div>
                <div className="field"><label>Stock Inicial</label><input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" /></div>
                <div className="field"><label>Alerta Mínimo (Stock Bajo)</label><input type="number" name="min" value={formData.min} onChange={handleInputChange} min="1" /></div>
                <div className="field"><label>Precio de Venta</label><input type="text" name="val" value={formData.val} onChange={handleInputChange} placeholder="Ej. $150.000" /></div>
              </div>
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <button className="btn success" onClick={guardarNuevoProducto}>💾 Guardar Producto</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            <input 
              type="text" 
              placeholder="Buscar por código, montura, lente..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="tb-search"
              style={{ padding: '8px 12px', flex: 1, maxWidth: '400px' }}
            />
            <select className="tb-search" style={{ padding: '8px 12px' }}>
              <option value="">Todas las Categorías</option>
              <option>Monturas</option>
              <option>Lentes de Contacto</option>
              <option>Soluciones y Gotas</option>
            </select>
          </div>

          <table className="tbl">
            <thead>
              <tr><th>Código / Ref</th><th>Producto</th><th>Categoría</th><th>Precio Venta</th><th>Stock</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: 'var(--text2)' }}>{item.cod}</td>
                  <td>{item.name}</td>
                  <td>{item.cat}</td>
                  <td>{item.val}</td>
                  <td>
                    {item.stock <= item.min ? (
                      <span className="pill pill-canc">{item.stock} - Bajo</span>
                    ) : (
                      <span className="pill pill-done">{item.stock} - Óptimo</span>
                    )}
                  </td>
                  <td style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn" onClick={() => editItem(item.cod)} style={{ padding: '3px 8px', fontSize: '.7rem' }}>Editar Precio</button>
                    <button className="btn danger" onClick={() => subStock(item.cod)} style={{ padding: '3px 8px', fontSize: '.7rem' }} title="Reducir Stock">-</button>
                    <button className="btn success" onClick={() => addStock(item.cod)} style={{ padding: '3px 8px', fontSize: '.7rem' }} title="Aumentar Stock">+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventario;