/* eslint-disable no-unused-vars */
import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import webstomp from "webstomp-client";
import MyCanvasComponent from "./MyCanvasComponent";

function App() {
  const [token, setToken] = useState("");
  const [isToken, setIsToken] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [tempStompClient, setTempStompClient] = useState(null);
  const [isSubscribedToTopic, setIsSubscribedToTopic] = useState(false);
  const [subscriptionObject, setSubscriptionObject] = useState(null);
  const [mensajeSalida, setMensajeSalida] = useState(null);

  const broker = "wss://iot3.ischdesign.com:9097/socket-connect";
  const topic = "/topic/status";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { username, password } = e.target;
    const response = await axios.post(
      "https://iot3.ischdesign.com:8181/api/auth/signin",
      {
        username: username.value,
        password: password.value,
      }
    );
    if (response.data.token) {
      setToken(response.data.token);
      setIsToken(true);
      setIsLoading(false);
    }
  };

  const handleConnectSocket = () => {
    setIsLoading(true);
    const stompClient = webstomp.client(broker);
    stompClient.connect({ Authorization: `Bearer ${token}` }, function (frame) {
      console.log("Conectado al servidor de WebSocket: " + frame);
      setIsConnected(true);
      setTempStompClient(stompClient);
      setIsLoading(false);
    });
  };

  const handleDisconnectSocket = () => {
    handleUnsubscribeTopic();
    if (tempStompClient !== null) {
      tempStompClient.disconnect();
    }
    setIsToken(false);
    setToken("");
    setIsConnected(false);
    setIsSubscribed(false);
    console.log("Desconectado del servidor de WebSocket");
  };

  const handleSubscribeTopic = () => {
    if (tempStompClient !== null && tempStompClient.connected) {
      const newSubscriptionObject = tempStompClient.subscribe(
        topic,
        (message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            setMensajeSalida(parsedMessage);
          } catch (error) {
            console.error("Error al analizar el mensaje como JSON:", error);
          }
        }
      );
      setSubscriptionObject(newSubscriptionObject);
      setIsSubscribed(true);
      setIsSubscribedToTopic(true);
    } else {
      console.error("No se ha conectado al servidor de WebSocket");
    }
  };

  const handleUnsubscribeTopic = () => {
    if (subscriptionObject !== null) {
      setIsLoading(true);
      subscriptionObject.unsubscribe();
      setSubscriptionObject(null);
      setIsSubscribedToTopic(false);
      setIsSubscribed(false);
      setIsLoading(false);
    } else {
      console.log("No hay suscripción activa");
    }
  };

  useEffect(() => {
    // Aquí puedes realizar cualquier lógica adicional cuando cambie la suscripción, si es necesario.
  }, [isSubscribedToTopic]);

  if (isLoading) return <span className="loader"></span>;

  return (
    <div>
      <h1>Prueba protocolo STOMP</h1>
      {!isToken ? (
        <form onSubmit={handleLogin} className="estiloForm">
          <input type="text" placeholder="Usuario" name="username" />
          <input type="password" placeholder="Contraseña" name="password" />
          <button type="submit">Ingresar</button>
        </form>
      ) : (
        <div>
          {!isConnected ? (
            <form className="estiloForm">
              <input
                type="text"
                placeholder="URL websocket"
                value={broker}
              ></input>
              <input value={token}></input>
              <button onClick={handleConnectSocket}>Conectar</button>
            </form>
          ) : (
            <>
              <div className="botones">
                {!isSubscribed ? (
                  <button onClick={handleSubscribeTopic}>Suscribirse</button>
                ) : (
                  <button onClick={handleUnsubscribeTopic}>
                    Desuscribirse
                  </button>
                )}
                <button onClick={handleDisconnectSocket}>Desconectar</button>
              </div>
              {isSubscribed && mensajeSalida && (
                <MyCanvasComponent data={mensajeSalida} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
