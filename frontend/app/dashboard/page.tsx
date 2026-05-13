"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [news, setNews] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await axios.get("http://localhost:3000/news", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNews(res.data);
    } catch (err) {
      console.error(err);
    }
  };
// 
  const createNews = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3000/news",
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTitle("");
      setContent("");

      fetchNews();
    } catch (err) {
      console.error(err);
      alert("Gagal tambah berita");
    }
  };

  const updateNews = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/news/${editId}`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTitle("");
      setContent("");
      setEditId(null);

      fetchNews();
    } catch (err) {
      console.error(err);
      alert("Gagal update berita");
    }
  };

  const deleteNews = async (id: number) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNews();
    } catch (err) {
      console.error(err);
      alert("Gagal hapus berita");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    router.push("/");
  };

  return (
    <div className="p-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>

        <button
          onClick={logout}
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          Logout
        </button>
      </div>

      <div className="mb-8 rounded border p-4">
        <h2 className="mb-4 text-xl font-bold">Tambah Berita</h2>

        <input
          type="text"
          placeholder="Judul"
          className="mb-3 w-full rounded border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Isi berita"
          className="mb-3 w-full rounded border p-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={() => {
            if (editId) {
              updateNews();
            } else {
              createNews();
            }
          }}
          className="rounded bg-black px-4 py-2 text-white"
        >
          {editId ? "Update" : "Tambah"}
        </button>
      </div>

      <div className="space-y-4">
        {news.map((item: any) => (
          <div key={item.id} className="rounded border p-4 shadow">
            <h2 className="text-xl font-bold">{item.title}</h2>

            <p>{item.content}</p>

            <button
              onClick={() => {
                setEditId(item.id);
                setTitle(item.title);
                setContent(item.content);
              }}
              className="mt-3 rounded bg-blue-500 px-3 py-1 text-white"
            >
              Edit
            </button>

            <button
              onClick={() => deleteNews(item.id)}
              className="ml-2 mt-3 rounded bg-red-500 px-3 py-1 text-white"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
