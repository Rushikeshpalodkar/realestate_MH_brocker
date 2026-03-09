import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { sampleProperties } from '../../data/sampleProperties';

export default function AddProperty() {
  const navigate = useNavigate();
  const currentBroker = sessionStorage.getItem('currentBroker');

  const [formData, setFormData] = useState({
    title: '',
    type: 'Land',
    price: '',
    area: '',
    beds: '',
    baths: '',
    district: 'Pune',
    location: '',
    taluka: '',
    address: '',
    facing: 'East',
    tags: '',
    description: '',
    icon: '🏠',
    status: 'Available',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProperty = {
      id: (sampleProperties.length + 1).toString(),
      brokerEmail: currentBroker,
      ...formData,
      beds: formData.beds ? parseInt(formData.beds) : null,
      baths: formData.baths ? parseInt(formData.baths) : null,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sampleProperties.push(newProperty);
    alert('Property added successfully!');
    navigate('/admin/properties');
  };

  return (
    <AdminLayout>
      <h1 style={styles.title}>Add New Property</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={styles.input} placeholder="e.g. Premium Agricultural Land in Nashik" />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Type *</label>
            <select name="type" value={formData.type} onChange={handleChange} required style={styles.input}>
              <option value="Land">Land</option>
              <option value="Plot">Plot</option>
              <option value="House">House</option>
              <option value="Flat">Flat</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Price *</label>
            <input type="text" name="price" value={formData.price} onChange={handleChange} required style={styles.input} placeholder="e.g. ₹45,00,000" />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Area *</label>
            <input type="text" name="area" value={formData.area} onChange={handleChange} required style={styles.input} placeholder="e.g. 2 Acres or 950 sq ft" />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Bedrooms</label>
            <input type="number" name="beds" value={formData.beds} onChange={handleChange} style={styles.input} placeholder="Optional" />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Bathrooms</label>
            <input type="number" name="baths" value={formData.baths} onChange={handleChange} style={styles.input} placeholder="Optional" />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>District *</label>
            <select name="district" value={formData.district} onChange={handleChange} required style={styles.input}>
              <option value="Pune">Pune</option>
              <option value="Nashik">Nashik</option>
              <option value="Aurangabad">Aurangabad</option>
              <option value="Satara">Satara</option>
              <option value="Kolhapur">Kolhapur</option>
              <option value="Ratnagiri">Ratnagiri</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Location *</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required style={styles.input} placeholder="e.g. Nashik, Maharashtra" />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Taluka *</label>
            <input type="text" name="taluka" value={formData.taluka} onChange={handleChange} required style={styles.input} placeholder="e.g. Dindori" />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Facing *</label>
            <select name="facing" value={formData.facing} onChange={handleChange} required style={styles.input}>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North">North</option>
              <option value="South">South</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Icon</label>
            <input type="text" name="icon" value={formData.icon} onChange={handleChange} style={styles.input} placeholder="e.g. 🌾" />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Status *</label>
            <select name="status" value={formData.status} onChange={handleChange} required style={styles.input}>
              <option value="Available">Available</option>
              <option value="Under Negotiation">Under Negotiation</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Address *</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required style={styles.input} placeholder="Full address with Gat No. or Plot No." />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Tags (comma separated)</label>
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} style={styles.input} placeholder="e.g. 7/12 Available, Clear Title, Road Touch" />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required style={{...styles.input, minHeight: '120px'}} placeholder="Detailed property description" />
        </div>

        <div style={styles.buttons}>
          <button type="submit" style={styles.submitButton}>Add Property</button>
          <button type="button" onClick={() => navigate('/admin/properties')} style={styles.cancelButton}>Cancel</button>
        </div>
      </form>
    </AdminLayout>
  );
}

const styles = {
  title: { fontSize: '36px', fontWeight: 'bold', marginBottom: '30px', color: '#333' },
  form: { background: 'white', borderRadius: '12px', padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#333' },
  input: { width: '100%', padding: '12px 16px', fontSize: '15px', border: '2px solid #ddd', borderRadius: '6px', fontFamily: 'Georgia, serif', boxSizing: 'border-box' },
  buttons: { display: 'flex', gap: '12px', marginTop: '30px' },
  submitButton: { padding: '14px 32px', fontSize: '16px', fontWeight: 'bold', color: 'white', background: '#8b6d38', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Georgia, serif' },
  cancelButton: { padding: '14px 32px', fontSize: '16px', fontWeight: 'bold', color: '#666', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Georgia, serif' },
};
