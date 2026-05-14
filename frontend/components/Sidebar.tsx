"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="h-screen w-64 bg-gray-900 p-5 text-white">
      <h1 className="mb-10 text-2xl font-bold">
        DESAKU DIGITAL
      </h1>

      <div className="space-y-3">

        <Link
          href="/dashboard"
          className={`block rounded p-3 transition ${
            pathname === "/dashboard"
              ? "bg-blue-500"
              : "hover:bg-gray-700"
          }`}
        >
          📰 Dashboard
        </Link>

        <Link
          href="/village-profile"
          className={`block rounded p-3 transition ${
            pathname === "/village-profile"
              ? "bg-blue-500"
              : "hover:bg-gray-700"
          }`}
        >
          🏡 Profil Desa
        </Link>

        <Link
          href="/gallery"
          className={`block rounded p-3 transition ${
            pathname === "/gallery"
              ? "bg-blue-500"
              : "hover:bg-gray-700"
          }`}
        >
          🖼️ Galeri Desa
        </Link>

        <Link
          href="/users"
          className={`block rounded p-3 transition ${
            pathname === "/users"
              ? "bg-blue-500"
              : "hover:bg-gray-700"
          }`}
        >
          👥 Kelola User
        </Link>

        <button
          onClick={logout}
          className="w-full rounded bg-red-500 p-3"
        >
          🚪 Logout
        </button>

      </div>
    </div>
  );
}