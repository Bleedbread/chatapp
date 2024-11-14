import { useEffect, useState } from "react";
import "./App.css";
import socket from "./server";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomListPage from "./components/page/RoomListPage/RoomListPage.jsx";
import ChatPage from "./components/page/Chatpage/Chatpage.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [rooms, setRooms] = useState([])

  console.log(messageList);

  useEffect(() => {
    socket.on("rooms", (res) => {
      setRooms(res);
    });

    socket.on("message", (message) => {
      setMessageList((prevState) => prevState.concat(message));
    });

    askUsername();

    // 정리 단계에서 모든 소켓 리스너 제거
    return () => {
      socket.off("rooms");
      socket.off("message");
    };
  }, []);

  const askUsername = () => {
    const userName = prompt("당신의 이름을 입력하세요");
    console.log("user", userName);

    socket.emit("login", userName, (res) => {
      if (res?.ok) {
        setUser(res.data);
      }
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<RoomListPage rooms={rooms} />} />
        <Route exact path="/room/:id" element={<ChatPage user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
