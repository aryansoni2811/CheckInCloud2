import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/home';
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Please fill in all fields.');
            setTimeout(() => setError(''), 5000);
            return;
        }
        
        try {
            const response = await ApiService.loginUser({email, password});
            console.log('Login response:', response);
            
            if (response.statusCode === 200) {
                // Store auth data
                localStorage.setItem('token', response.token);
                localStorage.setItem('email', email);
                localStorage.setItem('userId', response.userId);
                localStorage.setItem('role', response.role);
                
                console.log('Stored role:', response.role);
                console.log('Is admin check:', response.role === 'ADMIN');
                console.log('Is user check:', response.role === 'USER');
                
                // Force a page reload to ensure all components update their auth state
                window.location.href = from;
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };
    
    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            
            <p className="register-link">
                Don't have an account? <a href="/register">Register</a>
            </p>
        </div>
    );
}

export default LoginPage;