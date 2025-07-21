import { useState } from 'react'
import './styling/App.css'
import { useAuth } from './context/AuthContext';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';


function App() {

    const { isLoggedIn } = useAuth();

    return (
        <>
            <Router>
                <NavLink to = '/'>Login</NavLink>
                <NavLink to = '/register'>Register</NavLink>

                <Routes>
                    <Route path='/' element={<Login/>} index/>
                    <Route path='/register' element={<Register/>} index/>
                    <Route path='/home' element={<Home/>} index/>
                </Routes>
            </Router>
        </>
    )
}

function Home(){
    const {logout} = useAuth();

    return(
        <> <button onClick={logout}>LOGOUT</button></>
    )
}

function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState(null);

    const {register} = useAuth();

    const handleRegister = async (e) =>{
        e.preventDefault();
        setError(null);

        try{
            await register(username, password);
            setUsername('');
            setPassword('');
            setConfirm('');
        }catch(error){
            setError(error.response?.data?.message || 'Registration failed. Please try again');
        }
    }
    
    return(
        <>
            <form onSubmit={handleRegister}>
                <fieldset>
                    <label htmlFor="username">Username</label>
                    <input 
                        id = 'username'
                        type="text" 
                        name='username'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required/>
                    
                    <label htmlFor="password">Password</label>
                    <input 
                        id = 'password'
                        type="password" 
                        name='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required/>
                    
                    <label htmlFor="confirm">Confirm Password</label>
                    <input 
                        id = 'confirm'
                        type="password" 
                        name='confirm'
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        required/>
                </fieldset>
                <button type='submit'>Sign Up</button>
                { error ? <p>{error}</p> : <></> }
            </form>
        </>
    ); 
}

function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const {login} = useAuth();

    const handleLogin = async (e) =>{
        e.preventDefault();
        setError(null);

        try{
            await login(username, password);
            setUsername('');
            setPassword('');
        }catch(error){
            setError(error.response?.data?.message || 'Registration failed. Please try again');
        }
    }
    
    return(
        <>
            <form onSubmit={handleLogin}>
                <fieldset>
                    <label htmlFor="username">Username</label>
                    <input 
                        id = 'username'
                        type="text" 
                        name='username'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required/>
                    
                    <label htmlFor="password">Password</label>
                    <input 
                        id = 'password'
                        type="password" 
                        name='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required/>
                </fieldset>
                <button type='submit'>Log in</button>
                { error ? <p>{error}</p> : <></> }
            </form>
        </>
    );
}

export default App
