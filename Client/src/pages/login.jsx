import { react } from "react";
import {useState} from "react";

function Login() {
    const { email, setEmail } = useState("");
    const { password, setPassword } = useState("");
    const {role, setRole} = useState("admin");
    return (
        <>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
            </select>
            <button>Submit</button>
        </> 
    )
}export default Login;