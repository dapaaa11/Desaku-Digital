'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [news, setNews] = useState([]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(
        'http://localhost:3000/news',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createNews = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:3000/news',
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle('');
      setContent('');

      fetchNews();
    } catch (err) {
      console.error(err);
      alert('Gagal tambah berita');
    }
  };

  return (
    <div className="p-10">
      <h1 className="mb-6 text-3xl font-bold">
        Dashboard Admin
      </h1>

      <div className="mb-8 rounded border p-4">
        <h2 className="mb-4 text-xl font-bold">
          Tambah Berita
        </h2>

        <input
          type="text"
          placeholder="Judul"
          className="mb-3 w-full rounded border p-2"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          placeholder="Isi berita"
          className="mb-3 w-full rounded border p-2"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
        />

        <button
          onClick={createNews}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Tambah
        </button>
      </div>

      <div className="space-y-4">
        {news.map((item: any) => (
          <div
            key={item.id}
            className="rounded border p-4 shadow"
          >
            <h2 className="text-xl font-bold">
              {item.title}
            </h2>

            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}