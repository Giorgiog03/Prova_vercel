import React, { useState } from 'react';

function LoginForm({ onSubmitForm }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Questa funzione gestisce il submit del form:
    // event.preventDefault(); blocca il comportamento predefinito del form (che ricaricherebbe la pagina).
    // onSubmitForm(email, password); chiama la funzione ricevuta dal genitore, passandogli i valori di email e password.


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
                    onChange={(e) => setEmail(e.target.value)}//aggiorna lo stato ad ogni modifica dell’input (lo stesso per la password).
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


//L’utente inserisce email e password.

//Quando preme il bottone, il form invia i dati tramite la funzione handleLogin.

//handleLogin passa i dati a onSubmitForm(email, password) ricevuta da App.jsx.

//App.jsx riceve i dati, fa la chiamata API per login, e aggiorna lo stato globale dell’app.