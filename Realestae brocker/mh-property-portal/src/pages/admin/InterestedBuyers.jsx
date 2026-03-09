import AdminLayout from '../../components/AdminLayout';
import { sampleInterests } from '../../data/sampleProperties';

export default function InterestedBuyers() {
  const currentBroker = sessionStorage.getItem('currentBroker');
  const myInterests = sampleInterests.filter(i => i.brokerEmail === currentBroker);

  return (
    <AdminLayout>
      <h1 style={{fontSize: '36px', fontWeight: 'bold', marginBottom: '10px', color: '#333'}}>Interested Buyers</h1>
      <p style={{fontSize: '16px', color: '#666', marginBottom: '30px'}}>
        Buyers who have expressed interest in your properties
      </p>

      <div style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        <div style={{display: 'grid', gridTemplateColumns: '200px 180px 1fr 150px 120px', padding: '16px 24px', background: '#f9f5f0', fontWeight: 'bold', borderBottom: '2px solid #e0e0e0'}}>
          <div>Buyer Name</div>
          <div>Phone</div>
          <div>Property Name</div>
          <div>Date</div>
          <div>Time</div>
        </div>

        {myInterests.length === 0 ? (
          <div style={{padding: '60px 24px', textAlign: 'center', color: '#999'}}>
            No leads yet. Buyers will appear here when they express interest in your properties.
          </div>
        ) : (
          myInterests.reverse().map(interest => (
            <div key={interest.id} style={{display: 'grid', gridTemplateColumns: '200px 180px 1fr 150px 120px', padding: '20px 24px', borderBottom: '1px solid #f0f0f0', alignItems: 'center'}}>
              <div style={{fontWeight: 'bold', color: '#333'}}>👤 {interest.buyerName || 'N/A'}</div>
              <div style={{fontWeight: 'bold', color: '#8b6d38'}}>📞 {interest.buyerPhone}</div>
              <div style={{color: '#666'}}>{interest.propertyTitle}</div>
              <div style={{color: '#666'}}>{new Date(interest.timestamp).toLocaleDateString()}</div>
              <div style={{color: '#666'}}>{new Date(interest.timestamp).toLocaleTimeString()}</div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
