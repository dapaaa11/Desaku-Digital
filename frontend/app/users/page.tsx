"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const changeRole = async (id: number, role: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:3000/users/${id}/role`,
        {
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10">
      <h1 className="mb-6 text-3xl font-bold">Kelola User</h1>

      <div className="space-y-4">
        {users.map((user: any) => (
          <div key={user.id} className="rounded border p-4 shadow">
            <h2 className="font-bold">{user.name}</h2>

            <p>{user.email}</p>

            <p>
              Role:
              <span className="ml-2 font-bold">{user.role}</span>
            </p>

            <button
              onClick={() =>
                changeRole(user.id, user.role === "ADMIN" ? "USER" : "ADMIN")
              }
              className="mt-3 rounded bg-blue-500 px-3 py-1 text-white"
            >
              Ubah Role
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
