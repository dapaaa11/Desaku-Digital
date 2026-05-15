"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface SuratItem {
  id: number;
  nama: string;
  nik: string;
  jenis: string;
  keperluan: string;
  status: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function SuratPage() {
  const router = useRouter();
  const [surats, setSurats] = useState<SuratItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [editId, setEditId] = useState<number | null>(null);
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [jenis, setJenis] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  async function fetchSurats() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/surat`);
      setSurats(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data pengajuan surat");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    fetchSurats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (item: SuratItem) => {
    setEditId(item.id);
    setNama(item.nama);
    setNik(item.nik);
    setJenis(item.jenis);
    setKeperluan(item.keperluan);
    setStatus(item.status);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setNama("");
    setNik("");
    setJenis("");
    setKeperluan("");
    setStatus("");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/surat/${editId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Status pengajuan berhasil diperbarui");
      cancelEdit();
      fetchSurats();
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Pengajuan Surat?",
      text: "Data yang dihapus tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/surat/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Data pengajuan berhasil dihapus");
      fetchSurats();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus pengajuan");
    }
  };

  const getStatusColor = (currentStatus: string) => {
    const s = currentStatus.toUpperCase();
    switch (s) {
      case "SELESAI":
        return "bg-green-100 text-green-800 border-green-200";
      case "DITOLAK":
        return "bg-red-100 text-red-800 border-red-200";
      case "DIPROSES":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="min-h-screen flex-1 bg-gray-100 p-8">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">Manajemen Pengajuan Surat</h1>

          {/* Form Edit Status */}
          {editId && (
            <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6 animate-in fade-in slide-in-from-top-4">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Update Status Pengajuan
              </h2>
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemohon</label>
                    <input
                      type="text"
                      value={nama}
                      className="w-full rounded border p-2 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                    <input
                      type="text"
                      value={nik}
                      className="w-full rounded border p-2 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Surat</label>
                    <input
                      type="text"
                      value={jenis}
                      className="w-full rounded border p-2 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan</label>
                    <input
                      type="text"
                      value={keperluan}
                      className="w-full rounded border p-2 bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                      disabled
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status Pengajuan</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full md:w-1/2 rounded border p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                    required
                  >
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="rounded-xl bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {updating ? "Menyimpan..." : "Simpan Status"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-xl bg-gray-400 px-6 py-2 text-white transition hover:bg-gray-500 font-medium"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table Pengajuan */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Daftar Pengajuan Masuk</h2>
              <button 
                onClick={fetchSurats}
                className="text-sm text-blue-500 hover:underline"
              >
                Refresh Data
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <p className="text-gray-500 animate-pulse font-medium">Memuat data pengajuan...</p>
              </div>
            ) : surats.length === 0 ? (
              <div className="text-center py-10 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">Belum ada data pengajuan surat.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-800">
                    <tr>
                      <th className="p-4 font-semibold border-b">Tanggal</th>
                      <th className="p-4 font-semibold border-b">Nama Pemohon</th>
                      <th className="p-4 font-semibold border-b">NIK</th>
                      <th className="p-4 font-semibold border-b">Jenis Surat</th>
                      <th className="p-4 font-semibold border-b">Status</th>
                      <th className="p-4 font-semibold border-b text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surats.map((item) => (
                      <tr key={item.id} className="border-b transition hover:bg-gray-50">
                        <td className="p-4 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td className="p-4 font-medium text-gray-900">{item.nama}</td>
                        <td className="p-4 font-mono text-xs">{item.nik}</td>
                        <td className="p-4">
                          <div className="font-medium text-gray-800">{item.jenis}</div>
                          <div className="text-xs text-gray-500 line-clamp-1" title={item.keperluan}>{item.keperluan}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(item)}
                            className="rounded-lg bg-blue-50 px-3 py-1.5 text-blue-600 hover:bg-blue-100 transition font-medium"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-red-600 hover:bg-red-100 transition font-medium"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
