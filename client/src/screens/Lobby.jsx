import React, { useState, useCallback, useEffect } from 'react'
import { useSocket } from '../context/SocketProvider';
import { useNavigate } from 'react-router-dom';

const LobbyScreen = () => {
    const [email, setEmail] = useState('');
    const [room, setRoom] = useState('');

    const navigate = useNavigate();

    const socket = useSocket();

    const handleJoinRoom = useCallback((data) => {
        const { email, room } = data;
        navigate(`/room/${room}`);
    }, [navigate]);
    
    useEffect(() => {
        socket.on("room:join", handleJoinRoom);

        return () => socket.off("room:join", handleJoinRoom);
    }, [socket, handleJoinRoom]);


    const handleSubmitForm = useCallback((e) => {
        e.preventDefault();

        socket.emit("room:join", { email, room });
    }, [email, room, socket]);
  return (
    <div>
        <h1>Lobby</h1>
        <form onSubmit={handleSubmitForm}>
            <label htmlFor='email'>Email Id</label>
            <input 
                type='email'
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br></br>
            <label htmlFor="room">Room Number</label>
            <input 
                type='text'
                id='room'
                value={room}
                onChange={(e) => setRoom(e.target.value)}
            />
            <br />
            <button>Join</button>
        </form>
    </div>
  )
}

export default LobbyScreen