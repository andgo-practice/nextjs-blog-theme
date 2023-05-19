import '../styles/globals.css';
import 'prismjs/themes/prism-tomorrow.css';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function MyApp({ Component, pageProps }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <span className="theme-bejamas" />
      <Component {...pageProps} socket={socket} />
    </>
  );
}

export default MyApp;
