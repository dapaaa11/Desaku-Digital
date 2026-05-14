"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface GalleryItem {
  id: number;
  title: string | null;
  image: string;
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  async function fetchGalleries() {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/gallery");
      setGalleries(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Validasi tipe file
      const validFiles = filesArray.filter(file => file.type.startsWith("image/"));
      if (validFiles.length !== filesArray.length) {
        toast.error("Beberapa file bukan gambar dan diabaikan.");
      }

      setSelectedFiles(validFiles);
      
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error("Pilih minimal satu foto");
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });
      if (uploadTitle) {
        formData.append("title", uploadTitle);
      }

      await axios.post("http://localhost:3000/gallery", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Foto berhasil diunggah");
      setSelectedFiles([]);
      setPreviews([]);
      setUploadTitle("");
      
      // Cleanup preview URLs
      previews.forEach(p => URL.revokeObjectURL(p));
      
      fetchGalleries();
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunggah foto");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (item: GalleryItem) => {
    const { value: newTitle } = await Swal.fire({
      title: "Edit Judul Foto",
      input: "text",
      inputLabel: "Judul baru",
      inputValue: item.title || "",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    });

    if (newTitle !== undefined) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:3000/gallery/${item.id}`, { title: newTitle }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Judul berhasil diubah");
        fetchGalleries();
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengubah judul");
      }
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Foto?",
      text: "Foto yang dihapus tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/gallery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Foto berhasil dihapus");
      fetchGalleries();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus foto");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="min-h-screen flex-1 bg-gray-100 p-8">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">Galeri Desa</h1>

          {/* Form Upload */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-xl font-bold">Tambah Foto Galeri</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <input
                type="text"
                placeholder="Judul (opsional) - berlaku untuk semua foto yang diupload"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="w-full rounded border p-2"
              />

              <div className="flex items-center gap-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full rounded border p-2 bg-white"
                />
                <button
                  type="submit"
                  disabled={uploading || selectedFiles.length === 0}
                  className="rounded-xl bg-black px-5 py-2 text-white transition hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                >
                  {uploading ? "Mengunggah..." : "Upload Foto"}
                </button>
              </div>

              {/* Preview */}
              {previews.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-500">Preview ({previews.length} foto):</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previews.map((src, idx) => (
                      <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border bg-white shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Grid Galeri */}
          <div>
            <h2 className="mb-4 text-xl font-bold">Daftar Foto</h2>
            {loading ? (
              <p className="text-gray-500">Memuat galeri...</p>
            ) : galleries.length === 0 ? (
              <p className="text-gray-500">Belum ada foto di galeri.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleries.map((item) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-xl bg-white shadow-md border border-gray-100 transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="aspect-square bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`http://localhost:3000/uploads/${item.image}`}
                        alt={item.title || "Galeri"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold truncate" title={item.title || "Tanpa Judul"}>
                        {item.title || <span className="text-gray-400 italic">Tanpa Judul</span>}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex-1 rounded-lg bg-blue-500 py-1.5 text-sm font-medium text-white transition hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 rounded-lg bg-red-500 py-1.5 text-sm font-medium text-white transition hover:bg-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
