// ULTRA BASİT TEST - Her şey çalışıyor mu?
export default function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #ede9fe, #ffffff, #ede9fe)'
    }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '20px',
          color: '#8B5CF6',
          fontWeight: 'bold'
        }}>
          🌲 Forest
        </div>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
          ✅ React Çalışıyor!
        </h1>
        <p style={{ color: '#666', fontSize: '18px' }}>
          Eğer bunu görüyorsanız, proje başarıyla render oluyor.
        </p>
      </div>
    </div>
  );
}

