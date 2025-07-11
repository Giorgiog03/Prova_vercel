import React,{useState} from "react";
function RegForm({ onRegisterSubmit}){
    const [username, setUsername]= useState("");
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        onRegisterSubmit({ username, email, password});
        setUsername("");
        setEmail("");
        setPassword("");
    };
    return(
        <form onSubmit={handleSubmit}>


            <div>
                <label className="username">Username:</label>
                <input
                    type="text"
                    id="username "
                    value={username}
                    onChange={(e)=> setUsername(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                    minLength={6}
                />
            </div>

            <button id="submit-reg" type="submit">Registrati</button>
        </form>
    )
}
export default RegForm