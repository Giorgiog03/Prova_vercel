import React, { useState, useEffect } from 'react';
import Recensione from './Recensione';

function Campo({ campo, currentUser, recensioni, onRecensioneCreated, onDeleteRecensione, onPrenota }) {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [recensioniCampo, setRecensioniCampo] = useState([]);
  const [testo, setTesto] = useState('');
  const campoId = campo._id;

  //useEffect utilizzato con recensioni come secondo argomento, in modo che venga invocato ad ogni cambiamento dello
  //stato recensioni. Imposta lo stato recensioniCampo.
  useEffect(()=>{
    setRecensioniCampo(recensioni.filter(recensione=>recensione.campo==campoId))
  }, [recensioni])

  //Handler per l'invio della recensione. Fa richiesta a /campi/recensioni. In caso di risposta positiva chiama
  //onRecensioniCreated.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/campi/recensioni`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ testo, campoId}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({message: `Errore HTTP: ${response.status}`}));
        window.alert("Creazione recensione fallita");
        throw new Error(errorData.message || `Errore durante la creazione della recensione: ${response.statusText}`);
      }

      const newRecensioneData = await response.json();
      setTesto('');
      onRecensioneCreated(newRecensioneData); // comunica al padre
      
    } catch (err) {
      window.alert("Creazione recensione fallita");
      console.error('Errore creazione recensione:', err);
    }
  };

  
  return (
      <div>
      <div className="campo-container">
       <h3>{campo.nome}</h3> {/* Mostra il nome del campo */}
        <img src={`/img/${campo.immagine}`} alt={campo.nome} /> {/* Mostra l'immagine del campo */}
      </div>
      <div className="box-recensioni">
        {/*lista recensioni*/}
      <h3>Recensioni</h3>
      {recensioniCampo.map(recensione => (
        
        <Recensione
          key={recensione._id}
          recensione={recensione}
          onDeleteRecensione={onDeleteRecensione}
          currentUser={currentUser}
        />
      ))}
      </div>
      {/*Form per scrivere una nuova recensione */}

      <form id="form-recensioni" onSubmit={handleSubmit}>
        <textarea
          placeholder="Scrivi la tua recensione..."
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
        />
        <button type="submit" className="campo-buttons">INVIA RECENSIONE</button>
      </form>

{/*Bottone che chiama onPrenota in modo da renderizzare il form di prenotazione */}
        <button className="campo-buttons" onClick={() => onPrenota(campo._id)}>PRENOTA QUESTO CAMPO</button>
    </div>
  );
}


export default Campo;
