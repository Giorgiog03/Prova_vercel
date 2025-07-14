import React, { useState, useEffect } from 'react';

function Recensione({ recensione, currentUser, onDeleteRecensione }) {
    const [isAuthor, setIsAuthor] = useState(false);

    //useEffect con secondo argomento vuoto, chiamato solo al mount del componente. Effettua controllo sull'autore
    //della recensione, impostandone di conseguenza lo stato isAuthor.
    useEffect(() => {
        if (currentUser && currentUser.id === recensione.autore._id) {
            setIsAuthor(true);
        } else {
            setIsAuthor(false);
        }
    }, []);

    return (
        <div className="recensione-container">
            <div className="recensione-header">
            <h4>{recensione.autore.username || 'Utente Anonimo'}</h4>
            <h5>{recensione.createdAt.slice(0,10)}</h5>
            </div>
            <div className="testo-recensione">
            <p>{recensione.testo}</p>
            {//pulsante di eliminazione recensione mostrato solo se isAuthor è true
                isAuthor && (
                <button onClick={() => onDeleteRecensione(recensione._id)}>
                    ELIMINA RECENSIONE
                </button>
            )}
            </div>
        </div>
    );
}
export default Recensione
