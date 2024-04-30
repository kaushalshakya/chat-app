import React, { useEffect, useState } from "react";
import Users from "./Users";
import Messages from "./Messages";
import { useNavigate } from "react-router-dom";
import NullUser from "./NullUser";

const Layout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex w-full gap-10">
      <div className="w-1/5">
        <Users setUser={setUser} token={token} />
      </div>
      <div className="w-4/5">
        {user ? <Messages user={user} token={token} /> : <NullUser />}
      </div>
    </div>
  );
};

export default Layout;
