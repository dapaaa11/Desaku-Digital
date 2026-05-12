'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [news, setNews] = useState([]);

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

  return (
    <div className="p-10">
      <h1 className="mb-6 text-3xl font-bold">
        Dashboard Admin
      </h1>

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