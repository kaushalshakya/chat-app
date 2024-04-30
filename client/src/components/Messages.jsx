import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

const Messages = ({ user, token }) => {
  const userDetails = jwtDecode(token);
  const messagesContainerRef = useRef();
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(io());

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      query: {
        receiver: user._id,
        sender: userDetails.id,
      },
    });

    setSocket(newSocket);
  }, [user]);

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ["getMessages"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/messages", {
        params: { id: user._id },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  socket.on("send", () => {
    refetch();
  });

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [data]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) {
      return;
    }
    socket.connect();
    socket.emit("send", message.trim());
    setMessage("");
  };

  useEffect(() => {
    setMessage("");
  }, [user]);

  useEffect(() => {
    refetch();
  }, [user]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (error) {
    console.log(error);
  }

  return (
    <div className="p-5 w-full relative">
      <div className="container mx-auto bg-base-300 z-10 fixed top-0 py-5 text-center">
        <p>{user.username}</p>
      </div>
      <div
        ref={messagesContainerRef}
        className="pt-16 flex flex-col gap-5 overflow-y-scroll hide-scrollbar"
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        {data.length ? (
          data.map((message) => (
            <div
              className={`chat ${
                message.receiver._id === user._id ? "chat-end" : "chat-start"
              }`}
              key={message.id}
            >
              <div
                className={
                  message.receiver._id === user._id
                    ? "chat-bubble chat-bubble-primary"
                    : "chat-bubble"
                }
              >
                {message.message}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full flex justify-center items-center">
            Nothing to see here
          </div>
        )}
      </div>
      <form
        onSubmit={sendMessage}
        className="join container mx-auto pl-14 fixed bottom-5"
      >
        <input
          className="input input-bordered w-4/6 join-item"
          placeholder="Send message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="btn join-item w-1/4 rounded-r-full"
          onClick={sendMessage}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Messages;
