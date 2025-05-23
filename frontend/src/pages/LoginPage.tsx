import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!email) return;
        if (!isValidEmail(email)) {
            alert('Not a valid email');
            return;
        }
        localStorage.setItem('email', email);
        navigate('/board');
    }

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    return (
        <div className="container">
            <h2>Login</h2>
            <input 
                type="email" 
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleLogin}>Log in</button>
        </div>
    );
}

export default LoginPage;