'use client'
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';



const RealtimeChat = () => {


  const ENDPOINT = 'http://www.localhost:8080'

  const socket = io(ENDPOINT, {
    transports: ['websocket']
 });

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false)
//
  const inputRef = useRef('')
  const onConnected = () => {
    setIsConnected(true)
  }
  //
  const onDisconnected = () => {
    setIsConnected(false)
  }
  useEffect(() => {
    //Ensure it's connected
    // const connection = socket.on('connect',()=> {
    //     return "Connected"
    // })
    if(socket.connected){
       onConnected()
    } else {
        onDisconnected()
    }
    // socket.on('connect', onConnected())
    // socket.on('disconnected', onDisconnected())
    //
    // socket.off("connect", onConnected());
    // socket.off("disconnect", onDisconnected());

    // Listen for incoming messages
    socket.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    //   setMessages((prevMsg) => [message])
    });
    //Handle Error
    socket.on('connect_error',(err) => {
      console.log(`Sockect Connection Error: ${err.message}`)
    })
  }, [socket]);

  const sendMessage = () => {
    //Remove blank space in the text
    let text;
    text = inputRef.current?.value
    let msg = text.trim()
    // setNewMessage(msg)
    if(msg){
        socket.emit('chat message', msg);
        msg = ''
        text = ''
        setNewMessage('');
    }
    
  };
 console.log('Chat: ',messages)
  return (
    <div className="w-64 h-80 fixed flex flex-col bottom-10 right-10 z-50 bg-black text-white">
      <div className='w-full h-12 bg-gray-800 flex items-center justify-between px-2'>
        <h1 className='text-base'>Live Chat</h1>
        {
            isConnected ?
            <div className='w-auto h-full flex place-items-center gap-x-2'>
               <span className='text-xs'>Disconnected</span>
               <span className='w-3 h-3 rounded-full bg-red-300'></span>
            </div>
            :
           <div className='w-auto h-full flex place-items-center gap-x-2'>
              <span className='text-xs'>Connected</span>
              <span className='w-3 h-3 rounded-full bg-green-300'></span>
           </div>
        }
      </div>
      <div className='w-full h-full bg-gray-400 flex flex-col text-white px-2 py-4 scrollbar gap-y-2' >
        {messages.slice(1).map((message, index) => (
          <div className='w-auto flex gap-x-2 items-center' key={index}>
            <img src='/users/userOne.png' className='w-10 h-10 rounded-full border-2 border-green-300' alt='costumer One' />
            <p>{message}</p>
          </div>
        ))}
      </div>
      <div className='w-full h-12 flex'>
        <input
            type="text"
            // value={newMessage}
            ref={inputRef}
            // onChange={sendMessage}
            className='w-full h-full focus:outline-none p-2 placeholder:text-white text-white bg-gray-600'
        />
        <button onClick={sendMessage} className='w-14 h-full bg-blue-600  focus:outline-none cursor-pointer'>Send</button>
        </div>
    </div>
  );
};

export default RealtimeChat;