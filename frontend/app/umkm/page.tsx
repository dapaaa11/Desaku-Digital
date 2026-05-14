"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface UmkmItem {
  id: number;
  name: string;
  description: string;
  whatsapp: string;
  address: string;
  image: string | null;
}

export default function UmkmPage() {
  const router = useRouter();
  const [umkms, setUmkms] = useState<UmkmItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  
  // Edit states
  const [editId, setEditId] = useState<number | null>(null);

  async function fetchUmkms() {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/umkm");
      setUmkms(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data UMKM");
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
    fetchUmkms();
    
    // Cleanup preview on unmount
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        toast.error("File yang dipilih bukan gambar.");
        return;
      }

      // Revoke old preview
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setWhatsapp("");
    setAddress("");
    setSelectedFile(null);
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview("");
    setEditId(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !whatsapp || !address) {
      toast.error("Harap isi semua kolom teks");
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      formData.append("name", name);
      formData.append("description", description);
      formData.append("whatsapp", whatsapp);
      formData.append("address", address);
      
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (editId) {
        // Update mode
        await axios.put(`http://localhost:3000/umkm/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Data UMKM berhasil diperbarui");
      } else {
        // Create mode
        if (!selectedFile) {
          toast.error("Pilih foto UMKM");
          setUploading(false);
          return;
        }

        await axios.post("http://localhost:3000/umkm", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Data UMKM berhasil ditambahkan");
      }

      resetForm();
      fetchUmkms();
    } catch (error) {
      console.error(error);
      toast.error(editId ? "Gagal memperbarui UMKM" : "Gagal menambahkan UMKM");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: UmkmItem) => {
    setEditId(item.id);
    setName(item.name);
    setDescription(item.description);
    setWhatsapp(item.whatsapp);
    setAddress(item.address);
    
    // Clear selected file and preview
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(item.image ? `http://localhost:3000/uploads/${item.image}` : "");
    
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Data UMKM?",
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
      await axios.delete(`http://localhost:3000/umkm/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Data UMKM berhasil dihapus");
      fetchUmkms();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus UMKM");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="min-h-screen flex-1 bg-gray-100 p-8">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">Katalog UMKM Desa</h1>

          {/* Form Upload / Edit */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-xl font-bold">
              {editId ? "Edit Data UMKM" : "Tambah UMKM Baru"}
            </h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nama UMKM/Produk"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                
                <input
                  type="text"
                  placeholder="Nomor WhatsApp (Cth: 62812...)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <textarea
                placeholder="Deskripsi UMKM"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded border p-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <input
                type="text"
                placeholder="Alamat Lengkap"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto UMKM/Produk</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full rounded border p-2 bg-white"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {editId ? "Pilih file baru untuk mengganti gambar" : "Pilih satu foto unggulan"}
                  </p>
                </div>
                
                {preview && (
                  <div className="w-full sm:w-1/3">
                    <p className="mb-2 text-sm font-medium text-gray-500">Preview:</p>
                    <div className="relative aspect-video overflow-hidden rounded-lg border bg-white shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded-xl bg-black px-6 py-2 text-white transition hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                >
                  {uploading ? "Memproses..." : editId ? "Simpan Perubahan" : "Tambah UMKM"}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl bg-gray-400 px-6 py-2 text-white transition hover:bg-gray-500"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Grid UMKM */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Daftar UMKM</h2>
              <button 
                onClick={fetchUmkms}
                className="text-sm text-blue-500 hover:underline"
              >
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <p className="text-gray-500 animate-pulse">Memuat data UMKM...</p>
              </div>
            ) : umkms.length === 0 ? (
              <div className="text-center py-10 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">Belum ada data UMKM.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {umkms.map((item) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-xl bg-white shadow-md border border-gray-100 flex flex-col">
                    <div className="aspect-video bg-gray-100">
                      {item.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={`http://localhost:3000/uploads/${item.image}`}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          Tidak ada foto
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-1 truncate" title={item.name}>{item.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1" title={item.description}>
                        {item.description}
                      </p>
                      
                      <div className="space-y-1 mb-4 text-sm text-gray-500">
                        <p className="flex items-center gap-2 truncate" title={item.whatsapp}>
                          <span>📞</span> {item.whatsapp}
                        </p>
                        <p className="flex items-center gap-2 truncate" title={item.address}>
                          <span>📍</span> {item.address}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-auto">
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
