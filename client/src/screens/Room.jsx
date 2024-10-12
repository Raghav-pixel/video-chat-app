import React, { useEffect, useCallback, useState } from 'react'
import { useSocket } from '../context/SocketProvider';
import ReactPlayer from 'react-player';
import peer from '../service/peer';

const RoomPage = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async() => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
    }, []);

    const handleIncomingCall = useCallback(({ from, offer }) => {
        console.log(`Incoming call ${from}  ${offer}`);
    }, []);

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on("incoming:call", handleIncomingCall);

        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incoming:call", handleIncomingCall);
        }
    }, [socket, handleUserJoined, handleIncomingCall]);
  return (
    <div>
        <h1>Room Page</h1>
        <h4>{remoteSocketId ? 'Connected' : 'No one in room'}</h4>
        {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
        {
            myStream && 
            <>
                <h2>My Stream</h2>
                <ReactPlayer playing muted height="200px" width="300px" url={myStream} />
            </>
        }
    </div>
  )
}

export default RoomPage