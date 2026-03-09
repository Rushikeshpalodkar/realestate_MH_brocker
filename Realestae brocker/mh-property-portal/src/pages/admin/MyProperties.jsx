import AdminLayout from '../../components/AdminLayout';
import { sampleProperties } from '../../data/sampleProperties';
import { useNavigate } from 'react-router-dom';

export default function MyProperties() {
  const navigate = useNavigate();
  const currentBroker = sessionStorage.getItem('currentBroker');
  const myProperties = sampleProperties.filter(p => p.brokerEmail === currentBroker);

  return (
    <AdminLayout>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1 style={{fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#333'}}>My Properties</h1>
        <button onClick={() => navigate('/admin/properties/add')} style={{padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', color: 'white', background: '#8b6d38', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Georgia, serif'}}>
          + Add Property
        </button>
      </div>

      <div style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        <div style={{display: 'grid', gridTemplateColumns: '60px 1fr 120px 150px 120px 150px', padding: '16px 24px', background: '#f9f5f0', fontWeight: 'bold', borderBottom: '2px solid #e0e0e0'}}>
          <div>Icon</div>
          <div>Title</div>
          <div>Type</div>
          <div>Price</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {myProperties.map(property => (
          <div key={property.id} style={{display: 'grid', gridTemplateColumns: '60px 1fr 120px 150px 120px 150px', padding: '20px 24px', borderBottom: '1px solid #f0f0f0', alignItems: 'center'}}>
            <div style={{fontSize: '32px'}}>{property.icon}</div>
            <div style={{fontWeight: 'bold', color: '#333'}}>{property.title}</div>
            <div style={{color: '#666'}}>{property.type}</div>
            <div style={{color: '#8b6d38', fontWeight: 'bold'}}>{property.price}</div>
            <div>
              <span style={{padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: property.status === 'Available' ? '#e8f5e9' : '#fff3e0', color: property.status === 'Available' ? '#2e7d32' : '#ef6c00'}}>
                {property.status}
              </span>
            </div>
            <div style={{display: 'flex', gap: '8px'}}>
              <button onClick={() => navigate(`/admin/properties/edit/${property.id}`)} style={{padding: '6px 12px', fontSize: '13px', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                Edit
              </button>
              <button onClick={() => alert('Delete functionality will be added in Phase 3')} style={{padding: '6px 12px', fontSize: '13px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
