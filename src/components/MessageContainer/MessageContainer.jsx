import "./MessageContainer.css";
import { Container } from "@mui/system";

const MessageContainer = ({ messageList, user }) => {
  return (
    <div>
      {messageList.map((message, index) => {
        const isVisible =
          index === 0 ||
          messageList[index - 1].user.name === user.name ||
          messageList[index - 1].user.name === "system";
        return (
          <Container
            key={message._id || index} // message._id가 없으면 index를 key로 사용
            className="message-container">
            {message.user.name === "system" ? (
              <div className="system-message-container">
                <p className="system-message">{message.chat}</p>
              </div>
            ) : message.user.name === user.name ? (
              <div className="my-message-container">
                <div className="my-message">{message.chat}</div>
              </div>
            ) : (
              <div className="your-message-container">
                <img
                  src="/profile.jpeg"
                  alt=""
                  className="profile-image"
                  style={{ visibility: isVisible ? "visible" : "hidden" }}
                />

                <div className="your-message">{message.chat}</div>
              </div>
            )}
          </Container>
        );
      })}
    </div>
  );
};

export default MessageContainer;
