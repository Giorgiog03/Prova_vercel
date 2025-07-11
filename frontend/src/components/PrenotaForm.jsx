import React, { useState } from "react";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PrenotaForm({ campoId,campo, onAnnulla, setCampoPrenotato}) {
  const [formData, setFormData] = useState(null);
  const [messaggio, setMessaggio] = useState("");
//È una funzione riutilizzabile per ogni input. 
// Prende il name dell’input ("data" o "ora") e aggiorna solo quel campo.
// prev => ({ ...prev, [name]: value }) significa: copia lo stato precedente e aggiorna solo il campo modificato. 
  const handleChange = (e) => {
    setFormData(e.target.value);
  };

  //Passa i dati inseriti nello slot e l’id del campo alla funzione onConferma --> che poi invierà tutto al backend.
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Combina giorno e orario nello slot tipo "17/07|10:00-12:00"
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/campi/prenotazioni/${campoId}`, {
                method: 'POST',
                headers: {'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
                body: JSON.stringify({date: formData}),
            });
     const data=await response.json()
            if (!response.ok) {
                setMessaggio(data.message || `Errore prenotazione: ${response.status}`);
               return;
            }
            const codice = data.codice;
            setMessaggio(`Campo prenotato con successo! Il tuo codice di prenotazione è ${codice}. Conserva questo codice e torna alla Home`);
        } catch (error) {
            console.error("Errore prenotazione campo:", error);
            setMessaggio("errore del server");
        }
    };

  //Chiama onAnnulla, che è in App.jsx, cambia la view e torna alla homepage.
  const handleCancel = (e) => {
    e.preventDefault();
    onAnnulla();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div id="prenota_div">
      <h2 className="prenota-form">STAI PRENOTANDO UN: <span className="nome-campo">{campo || "Campo"}</span></h2>


 <div className="input-div">
      <label> Data e ora: </label>
        <select name="date" value={formData} onChange={handleChange} required>
          <option value="">-- Seleziona giorno --</option>
          <option value="17/07|11:00-12:00">17/07 11:00-12:00</option>
          <option value="17/07|12:00-13:00">17/07 12:00-13:00</option>
          <option value="18/07|11:00-12:00">18/07 11:00-12:00</option>
          <option value="18/07|12:00-13:00">18/07 12:00-13:00</option>
          <option value="19/07|11:00-12:00">19/07 11:00-12:00</option>
          <option value="19/07|12:00-13:00">19/07 12:00-13:00</option>
          <option value="20/07|11:00-12:00">20/07 11:00-12:00</option>
          <option value="20/07|12:00-13:00">20/07 12:00-13:00</option>
          <option value="21/07|11:00-12:00">21/07 11:00-12:00</option>
          <option value="21/07|12:00-13:00">21/07 12:00-13:00</option>
          <option value="22/07|11:00-12:00">22/07 11:00-12:00</option>
          <option value="22/07|12:00-13:00">22/07 12:00-13:00</option>
          <option value="23/07|11:00-12:00">23/07 11:00-12:00</option>
          <option value="23/07|12:00-13:00">23/07 12:00-13:00</option>
          <option value="24/07|11:00-12:00">24/07 11:00-12:00</option>
          <option value="24/07|12:00-13:00">24/07 12:00-13:00</option>
        </select>
        </div>
      <br />
      <button type="submit" className="button">CONFERMA PRENOTAZIONE</button>
      <button onClick={handleCancel} className="button-link">ANNULLA</button>
       
       {messaggio && (
  <p className={messaggio.includes("successo") ? "messaggio-successo" : "messaggio-errore"}>
    {messaggio}
  </p>
        )}
      </div>
    </form>
    
  );
};

export default PrenotaForm;
