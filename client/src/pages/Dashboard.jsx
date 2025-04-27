function Dashboard() {
    const handleLogout = () => {
      localStorage.removeItem('token');
      window.location.href = '/';
    };
  
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Dashboard</h2>
          <p>Welcome to your dashboard!</p>
          <button style={styles.button} onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }
  
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f0f2f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      background: '#fff',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      width: '300px',
      textAlign: 'center',
    },
    title: {
      marginBottom: '20px',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      marginTop: '20px',
      cursor: 'pointer',
    },
  };
  
  export default Dashboard;
  
  
  