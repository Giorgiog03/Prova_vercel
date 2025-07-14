import React, { useState } from "react";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PrenotaForm({campoId, campo, onAnnulla}) {
  const [formData, setFormData] = useState(null);
  const [messaggio, setMessaggio] = useState("");

  const handleChange = (e) => {
    setFormData(e.target.value);
  };

  //Handler per la prenotazione. Fa richiesta a /campi/prenotazioni/:campoId. In base alla risposta ricevuta, imposta
    //il messaggio di ritorno da mostrare all'utente. In caso di risposta positiva, viene incluso nel messaggio anche
    //il codice di prenotazione generato dal backend.
  const handleSubmit = async (e) => {
    e.preventDefault();
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

  //Chiama onAnnulla, in modo da visualizzare la pagina di Home
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
       
       {//paragrafo contenente il messaggio di ritorno, se il corrispondente stato è non vuoto
           messaggio && (
  <p className={messaggio.includes("successo") ? "messaggio-successo" : "messaggio-errore"}>
    {messaggio}
  </p>
        )}
      </div>
    </form>
    
  );
};

export default PrenotaForm;
