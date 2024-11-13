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
    })

    // 소켓에서 'message' 이벤트를 수신할 때마다 콘솔에 출력
    socket.on("message", (message) => {
      setMessageList((prevState) => prevState.concat(message));
    });

    // 사용자 이름을 묻는 함수 호출
    askUsername();

    // 컴포넌트가 언마운트될 때 이벤트 정리
    return () => {
      socket.off("message");
    };
  }, []);

  const askUsername = () => {
    const userName = prompt("당신의 이름을 입력하세요");
    console.log("user", userName);

    socket.emit("login", userName, (res) => {
      if (res?.ok) {
        setUser(res.data); // 서버에서 받은 데이터를 user 상태로 설정
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
