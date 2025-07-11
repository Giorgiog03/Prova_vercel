import React, { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import RegForm from './components/RegForm';
import Campo from './components/Campo';
import PrenotaForm from './components/PrenotaForm';
import Navbar from "./components/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faShower, faCar, faTableTennisPaddleBall, faMugSaucer, faShirt} from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
    // Hook useState per gestire lo stato dell'utente loggato
    const [currentUser, setCurrentUser] = useState(null);
    // Stato per la lista dei campi
    const [campi, setCampi] = useState([]);
    // Stato per la lista delle recensioni
    const [recensioni, setRecensioni] = useState([]);
    // Stato per gestire la pagina fornita all'utente
    const [currentView, setCurrentView] = useState("pagIniziale");
    const [campoPrenotato, setCampoPrenotato] = useState(null);

    useEffect(() => {
        const loadInitialData = async () => {
            // Funzione helper interna a useEffect per le chiamate fetch
            // perché sono gestiti da loadInitialData
            const fetchDataForEffect = async (endpoint, options = {}) => {
                const localAccessToken = localStorage.getItem('accessToken');
                const headers = {
                    'Content-Type': 'application/json',
                    ...options.headers,
                };
                if (localAccessToken) {
                    headers['Authorization'] = `Bearer ${localAccessToken}`;
                }

                // NOTA: Per questo esempio, assumiamo che il token sia valido

                const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
                const responseData = response.status === 204 ? null : await response.json();

                if (!response.ok) {
                    const errorMessage = responseData?.message || `Errore caricamento ${endpoint}: ${response.status}`;
                    console.error(`Errore API per ${endpoint}:`, errorMessage);
                    throw new Error(errorMessage);
                }
                return responseData;
            };

            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken'); // Lo leggiamo comunque per decidere il flusso
            const campoprenotato = localStorage.getItem('campoPrenotato');
            try {
                if (campoprenotato) {
                    setCurrentUser(JSON.parse(storedUser));
                    setCurrentView("pagPrenotazione");
                    setCampoPrenotato(campoprenotato);
                }
                else if (storedUser && token) {
                    setCurrentUser(JSON.parse(storedUser));
                    setCurrentView("pagHome")
                }
                const campiData = await fetchDataForEffect('/campi');
                if (campiData) setCampi(campiData.campi || []);
                const recensioniData = await fetchDataForEffect('/campi/recensioni');
                if (recensioniData) setRecensioni(recensioniData.recensioni || []);
            } catch (e) {
                console.error("Errore durante il caricamento dei dati iniziali:", e);
                // Se l'errore è legato a un token non valido e l'utente era "loggato",
                // potremmo voler fare logout.
                if (storedUser && token && e.message.toLowerCase().includes("token")) {
                    handleLogout();
                }
            }
        };
        loadInitialData();
    }, []);
/*useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setCurrentUser(JSON.parse(storedUser));
            setCurrentView("pagHome");

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            };

            fetch(`${API_BASE_URL}/campi`, { headers })
                .then(res => res.json())
                .then(data => setCampi(data.campi || []))
                .catch(err => console.error("Errore fetch campi iniziale:", err));

            fetch(`${API_BASE_URL}/campi/recensioni`, { headers })
        .then(res => res.json())
                .then(data => setRecensioni(data.recensioni || []))
                .catch(err => console.error("Errore fetch recensioni iniziale:", err));
        }
    }, []);*/

    const handleRegisterSubmit = async (username, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(username, email, password),
            });
            const data = await response.json();

            if (!response.ok) {
                window.alert("Registrazione fallita");
                throw new Error(data?.message || `Errore autenticazione: ${response.status}`);
            }

        } catch (error) {
            console.error(`Errore API per /auth/register:`, error);
        }
    };

    const handleLoginSubmit = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(email, password),
            });
            const data = await response.json();

            if (!response.ok) {
                window.alert("Login fallito");
                throw new Error(data?.message || `Errore autenticazione: ${response.status}`);
            }

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            setCurrentUser(data.user);
            setCurrentView("pagHome");

            try {
                const campiResponse = await fetch(`${API_BASE_URL}/campi`);
                const campiData = await campiResponse.json();
                if (campiResponse.ok) setCampi(campiData.campi || []);
                else console.error("Errore ricaricamento campi dopo login");
            } catch (e) {
                console.error("Errore fetch campi dopo login:", e);
            }
            try {
                const recensioniResponse = await fetch(`${API_BASE_URL}/campi/recensioni`);
                const recensioniData = await recensioniResponse.json();
                if (recensioniResponse.ok) setRecensioni(recensioniData.recensioni || []);
                else console.error("Errore ricaricamento recensioni dopo login");
            } catch (e) {
                console.error("Errore fetch recensioni dopo login:", e);
            }

        } catch (error) {
            console.error(`Errore API per /auth/login:`, error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {method: 'POST', credentials: 'include'});
        } catch (e) {
            window.alert("Logout fallito");
            console.error("Logout API fallito, procedo con logout client:", e);
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setCurrentUser(null);
        setCurrentView("pagIniziale");
        setCampi([]);
        setRecensioni([]);
    };

    const onRecensioneCreated = function (newRecensioneData) {
        setRecensioni(prevRecensioni => [...prevRecensioni, newRecensioneData.recensione]);
    };


    const handleDeleteRecensione = async (recensioneId) => {
        if (!window.confirm("Sei sicuro di voler eliminare questa recensione?")) return;
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/campi/${recensioneId}`, {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${accessToken}`},
                
            });
            if (!response.ok) {
                window.alert("Eliminazione recensione fallita");
                const errorData = await response.json();
                throw new Error(errorData?.message || `Errore eliminazione: ${response.status}`);
            }
            setRecensioni(prevRecensioni => prevRecensioni.filter(recensione => recensione._id !== recensioneId));
        } catch (error) {
            window.alert("Eliminazione recensione fallita");
            console.error("Errore eliminazione recensione:", error);
        }
    };

    

   // Cambio questa funzione, SALVANDO TUTTO L'OGGETTO CAMPO:
const handlePrenota = (campoId) => {
    const campo = campi.find(c => c._id === campoId);
    setCampoPrenotato(campo._id);
    setCurrentView("pagPrenotazione");
    localStorage.setItem('campoPrenotato', campo._id);
};

    const handleAnnulla = function () {
        setCurrentView("pagHome");
        setCampoPrenotato(null);
        localStorage.removeItem('campoPrenotato');
    };

    if (currentView == "pagIniziale") {
        return (
            <div className="container-form">
                <div id = "logo-container">
                <img className="logo" src="https://live.staticflickr.com/65535/54643310871_e2e1569df3_b.jpg"></img>
                </div>
                <div id="registrati_div">
                    <h2 className="form-title">REGISTRATI</h2>
                    <RegForm
                        onRegisterSubmit={handleRegisterSubmit}
                    /></div>
                <div id="accedi_div" >
                    <h2 className="form-title">ACCEDI</h2>
                    <LoginForm
                        onSubmitForm={handleLoginSubmit}
                    /></div>
            </div>
        );
    }
{/*key={campo._id}*/}
    if (currentView == "pagHome") {
        return (
            <div className="home-container">
                <img className="logo" src="https://live.staticflickr.com/65535/54643310871_e2e1569df3_b.jpg"></img>
                <Navbar
                    onLogout={handleLogout}
                    onAnnulla={handleAnnulla}
                />
                <div className="mainnav">
                    <h2>INFORMAZIONI SULLA STRUTTURA </h2>
                    <p>E’ possibile prenotare campi da pallavolo, basket, calcio, padel e tennis.</p>
                    <h3>I nostri servizi:</h3>
                    <ul>
                        <li><FontAwesomeIcon icon={faShower} /><p>DOCCE</p></li>
                        <li><FontAwesomeIcon icon={faMugSaucer} /><p>BAR</p></li>
                        <li><FontAwesomeIcon icon={faShirt} /><p>SPOGLIATOI MASCHILI E FEMMINILI</p></li>
                        <li><FontAwesomeIcon icon={faCar} /><p>PARCHEGGIO</p></li>
                        <li><FontAwesomeIcon icon={faTableTennisPaddleBall} /><p>NOLEGGIO ATTREZZATURA</p></li>
                    </ul>
                    <h3>Limiti di prenotazione</h3>
                    <ul>
                        
                        <li>Puoi prenotare fino a 7 giorni</li>
                    </ul>
                </div>
                <div className="vertical-scroll">
                    <h2>I NOSTRI CAMPI</h2>
                    {campi.map(campo => (
                        <Campo

                            key={campo._id}
                            campo={campo}
                            currentUser={currentUser}
                            recensioni={recensioni}
                            onRecensioneCreated={onRecensioneCreated}
                            onDeleteRecensione={handleDeleteRecensione}
                            onPrenota={handlePrenota}
                        />
                    ))}
                </div>
            </div>
                )
                }

                return (
                <div className="container">
                    <div id = "logo-container1">
                    <img className="logo" src="https://live.staticflickr.com/65535/54643310871_e2e1569df3_b.jpg"></img>
                    </div>
                    <Navbar
                        onLogout={handleLogout}
                        onAnnulla={handleAnnulla}
                    />
                    <PrenotaForm
                        campoId={campoPrenotato}
                        campo={campi.find(c => c._id === campoPrenotato)?.nome}//new per passare il nome del campo, in fase di prenotazione
                        onAnnulla={handleAnnulla}
                        setCampoPrenotato={setCampoPrenotato}
                    />
                </div>
                )
                }

                export default App;
