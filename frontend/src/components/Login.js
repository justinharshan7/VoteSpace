import React, { useState } from 'react';

const API_BASE = `http://${window.location.hostname}:5000`;

function AuthForm({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        const endpoint = isLogin ? '/auth/login' : '/auth/register';

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            setLoading(false);

            if (res.ok) {
                if (isLogin) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.username);
                    setMessage({ text: 'Login Successful!', type: 'success' });
                    onLogin(data.username);
                } else {
                    setMessage({ text: 'Registration Successful! Please Login.', type: 'success' });
                    setIsLogin(true);
                }
            } else {
                setMessage({ text: data.error || 'Error occurred!', type: 'error' });
            }
        } catch (err) {
            setLoading(false);
            setMessage({ text: 'Backend Server Connection Error!', type: 'error' });
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p style={styles.subtitle}>
                        {isLogin ? 'Enter your credentials to access Polls' : 'Join us to create and vote on polls'}
                    </p>
                </div>

                <div style={styles.tabContainer}>
                    <button
                        style={{ ...styles.tab, ...(isLogin ? styles.activeTab : {}) }}
                        onClick={() => { setIsLogin(true); setMessage({ text: '', type: '' }); }}
                    >
                        Login
                    </button>
                    <button
                        style={{ ...styles.tab, ...(!isLogin ? styles.activeTab : {}) }}
                        onClick={() => { setIsLogin(false); setMessage({ text: '', type: '' }); }}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.submitBtn} disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                {message.text && (
                    <div style={{
                        ...styles.alert,
                        backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                        borderColor: message.type === 'success' ? '#c3e6cb' : '#f5c6cb'
                    }}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    pageContainer: {
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '12px'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px 30px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'left'
    },
    header: { marginBottom: '25px', textAlign: 'center' },
    title: { margin: '0 0 8px 0', fontSize: '26px', color: '#2d3748', fontWeight: '700' },
    subtitle: { margin: 0, fontSize: '14px', color: '#718096' },
    tabContainer: { display: 'flex', backgroundColor: '#edf2f7', borderRadius: '8px', padding: '4px', marginBottom: '25px' },
    tab: { flex: 1, padding: '10px', border: 'none', borderRadius: '6px', backgroundColor: 'transparent', fontSize: '14px', fontWeight: '600', color: '#718096', cursor: 'pointer', transition: 'all 0.3s ease' },
    activeTab: { backgroundColor: '#ffffff', color: '#4c51bf', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#4a5568' },
    input: { padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#f7fafc' },
    submitBtn: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#4c51bf', color: '#ffffff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', transition: 'background-color 0.2s' },
    alert: { marginTop: '20px', padding: '12px', borderRadius: '8px', fontSize: '13px', textAlign: 'center', border: '1px solid' }
};

export default AuthForm;