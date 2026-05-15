"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface GalleryItem {
  id: number;
  title: string | null;
  image: string;
}

export default function GalleryPage() {
  const router = useRouter();
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [uploadTitle, setUploadTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Edit states
  const [editId, setEditId] = useState<number | null>(null);

  async function fetchGalleries() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/gallery`);
      setGalleries(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat galeri");
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
    fetchGalleries();
    
    // Cleanup previews on unmount
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Validasi tipe file
      const validFiles = filesArray.filter(file => file.type.startsWith("image/"));
      if (validFiles.length !== filesArray.length) {
        toast.error("Beberapa file bukan gambar dan diabaikan.");
      }

      // Revoke old previews
      previews.forEach(p => URL.revokeObjectURL(p));

      setSelectedFiles(validFiles);
      
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const resetForm = () => {
    setUploadTitle("");
    setSelectedFiles([]);
    // Revoke previews before clearing
    previews.forEach(p => URL.revokeObjectURL(p));
    setPreviews([]);
    setEditId(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editId && selectedFiles.length === 0) {
      toast.error("Pilih minimal satu foto");
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      if (editId) {
        // Update mode
        if (uploadTitle) formData.append("title", uploadTitle);
        if (selectedFiles.length > 0) {
          formData.append("image", selectedFiles[0]); // Only one image for update
        }

        await axios.put(`${API_URL}/gallery/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Foto berhasil diperbarui");
      } else {
        // Create mode (Bulk)
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });
        if (uploadTitle) {
          formData.append("title", uploadTitle);
        }

        await axios.post(`${API_URL}/gallery`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Foto berhasil diunggah");
      }

      resetForm();
      fetchGalleries();
    } catch (error) {
      console.error(error);
      toast.error(editId ? "Gagal memperbarui foto" : "Gagal mengunggah foto");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditId(item.id);
    setUploadTitle(item.title || "");
    // Clear selected files and previews
    previews.forEach(p => URL.revokeObjectURL(p));
    setSelectedFiles([]);
    setPreviews([`${API_URL}/uploads/${item.image}`]);
    
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Foto?",
      text: "Foto yang dihapus tidak bisa dikembalikan",
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
      await axios.delete(`${API_URL}/gallery/${id}`, {
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

          {/* Form Upload / Edit */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-xl font-bold">
              {editId ? "Edit Foto Galeri" : "Tambah Foto Galeri"}
            </h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <input
                type="text"
                placeholder={editId ? "Judul Baru" : "Judul (opsional) - berlaku untuk semua foto yang diupload"}
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full">
                  <input
                    type="file"
                    multiple={!editId}
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full rounded border p-2 bg-white"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {editId ? "Pilih file baru untuk mengganti gambar" : "Bisa memilih banyak foto sekaligus"}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={uploading || (!editId && selectedFiles.length === 0)}
                    className="flex-1 sm:flex-none rounded-xl bg-black px-6 py-2 text-white transition hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                  >
                    {uploading ? "Memproses..." : editId ? "Simpan Perubahan" : "Upload Foto"}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 sm:flex-none rounded-xl bg-gray-400 px-6 py-2 text-white transition hover:bg-gray-500"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>

              {/* Preview */}
              {previews.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-500">
                    {editId ? "Gambar Saat Ini / Baru:" : `Preview (${previews.length} foto):`}
                  </p>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Daftar Foto</h2>
              <button 
                onClick={fetchGalleries}
                className="text-sm text-blue-500 hover:underline"
              >
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <p className="text-gray-500 animate-pulse">Memuat galeri...</p>
              </div>
            ) : galleries.length === 0 ? (
              <div className="text-center py-10 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">Belum ada foto di galeri.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleries.map((item) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-xl bg-white shadow-md border border-gray-100 transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="aspect-square bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${API_URL}/uploads/${item.image}`}
                        alt={item.title || "Galeri"}
                        className="h-full w-full object-cover"
                        loading="lazy"
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
