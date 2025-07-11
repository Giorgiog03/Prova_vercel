import React from 'react';


function Navbar({ onLogout, onAnnulla }) {
    return (
        <nav className="navbar">
            <button id="home-button" onClick={onAnnulla}>
                        HOME
                    </button>

                    <button id="logout-button" onClick={onLogout}>
                        LOGOUT
                    </button>
        </nav>
    );
}

export default Navbar;