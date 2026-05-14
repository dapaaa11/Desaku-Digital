"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const itemsPerPage = 5;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function fetchUsersCount() {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await axios.get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTotalUsers(res.data.length);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchNews() {
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
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    fetchNews();
    fetchUsersCount();
  }, []);

  const createNews = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      await axios.post("http://localhost:3000/news", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setContent("");
      setImage(null);
      setPreview("");

      fetchNews();

      toast.success("Berita berhasil ditambahkan");
    } catch (err) {
      console.error(err);
      toast.error("Gagal tambah berita");
    } finally {
      setLoading(false);
    }
  };

  const updateNews = async () => {
    setLoading(true);

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

      toast.success("Berita berhasil diperbarui");
    } catch (err) {
      console.error(err);
      toast.error("Gagal update berita");
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus berita?",
      text: "Data yang dihapus tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNews();

      toast.success("Berita berhasil dihapus");
    } catch (err) {
      console.error(err);

      toast.error("Gagal hapus berita");
    }
  };

  const filteredNews = news.filter((item: any) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const chartData = [
    {
      name: "Berita",
      total: news.length,
    },
    {
      name: "User",
      total: totalUsers,
    },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="min-h-screen flex-1 bg-gray-100 p-8">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-gray-500">Total Berita</h2>

            <p className="mt-2 text-3xl font-bold">{news.length}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-gray-500">Total User</h2>

            <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
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
            disabled={loading}
            onClick={() => {
              if (editId) {
                updateNews();
              } else {
                createNews();
              }
            }}
            className="rounded-xl bg-black px-5 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Loading..." : editId ? "Update" : "Tambah"}
          </button>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-4 shadow">
          <input
            type="text"
            placeholder="Cari berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border p-3"
          />

          {paginatedNews.map((item: any) => (
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

                  setPreview(
                    item.image
                      ? `http://localhost:3000/uploads/${item.image}`
                      : "",
                  );
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

          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
            >
              Prev
            </button>

            <span>
              Halaman {currentPage} dari {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Statistik Sistem</h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
