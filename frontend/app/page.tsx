"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';


export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);

      router.push('/dashboard');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Login gagal");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-[400px] rounded-xl border p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">Login Admin</h1>

        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-3 w-full rounded border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full rounded bg-black p-2 text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
}
