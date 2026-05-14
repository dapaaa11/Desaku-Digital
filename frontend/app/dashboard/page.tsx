"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [news, setNews] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 flex items-center justify-between rounded-2xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>

        <button
          onClick={logout}
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          Logout
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-gray-500">Total Berita</h2>

          <p className="mt-2 text-3xl font-bold">{news.length}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-gray-500">Status Admin</h2>

          <p className="mt-2 text-2xl font-bold text-green-600">Active</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-gray-500">Sistem</h2>

          <p className="mt-2 text-2xl font-bold">Online</p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-white p-6 shadow">
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

        <input
          type="file"
          className="mb-3 w-full rounded border p-2"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              setImage(file);
              setPreview(URL.createObjectURL(file));
            }
          }}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mb-4 h-56 w-full rounded-xl object-cover"
          />
        )}

        <button
          onClick={() => {
            if (editId) {
              updateNews();
            } else {
              createNews();
            }
          }}
          className="rounded-xl bg-black px-5 py-2 text-white transition hover:opacity-90"
        >
          {editId ? "Update" : "Tambah"}
        </button>
      </div>

      <div className="space-y-4">
        {news.map((item: any) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            {item.image && (
              <img
                src={`http://localhost:3000/uploads/${item.image}`}
                alt={item.title}
                className="mb-4 h-56 w-full rounded-xl object-cover"
              />
            )}

            <h2 className="text-xl font-bold">{item.title}</h2>

            <p className="mt-2 text-gray-600">{item.content}</p>

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
