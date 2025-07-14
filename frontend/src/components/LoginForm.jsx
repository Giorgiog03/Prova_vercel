import React, { useState } from 'react';

function LoginForm({ onSubmitForm }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();
        onSubmitForm( {email, password} );
    };

    return (
        <form onSubmit={handleLogin}>

            <div>
                <label className="login-email">Email:</label>
                <input
                    type="email"
                    id="login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="login-password">Password:</label>
                <input
                    type="password"
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button id="submit-log" type="submit">Login</button>
        </form>
    );
}

export default LoginForm;