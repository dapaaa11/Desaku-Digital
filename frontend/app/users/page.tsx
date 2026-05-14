"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  async function fetchUsers() {
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
  }

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const deleteUser = async (id: number) => {
    try {
      const token = localStorage.getItem("token");

      const confirmDelete = confirm("Yakin ingin menghapus user?");

      if (!confirmDelete) return;

      await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-10">
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

              <button
                onClick={() => deleteUser(user.id)}
                className="ml-2 mt-3 rounded bg-red-500 px-3 py-1 text-white"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
