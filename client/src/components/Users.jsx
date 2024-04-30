import { useQuery } from "@tanstack/react-query";
import React from "react";
import axios from "axios";

const Users = ({ setUser, token }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["getUsers"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (error) {
    console.log(error);
  }
  return (
    <div
      className="flex flex-col py-5 w-full overflow-y-scroll hide-scrollbar"
      style={{ maxHeight: "calc(100vh - 100px)" }}
    >
      {data.map((user) => (
        <div key={user._id}>
          <div
            className="grid rounded-box place-items-center cursor-pointer"
            onClick={() => setUser(user)}
          >
            {user.username}
          </div>
          <div className="divider"></div>
        </div>
      ))}
    </div>
  );
};

export default Users;
