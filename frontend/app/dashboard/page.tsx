"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [news, setNews] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");

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

  return (
    <div className="p-10">
      <h1 className="mb-6 text-3xl font-bold">Dashboard Admin</h1>

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
          </div>
        ))}
      </div>
    </div>
  );
}
