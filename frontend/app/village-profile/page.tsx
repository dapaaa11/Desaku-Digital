"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";

interface Profile {
  id?: number;
  name?: string;
  about?: string;
  vision?: string;
  mission?: string;
  address?: string;
  image?: string;
}

export default function VillageProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    vision: "",
    mission: "",
    address: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/village-profile");
      if (res.data && res.data.length > 0) {
        const data = res.data[0];
        setProfile(data);
        setFormData({
          name: data.name || "",
          about: data.about || "",
          vision: data.vision || "",
          mission: data.mission || "",
          address: data.address || "",
        });
        if (data.image) {
          setPreview(`http://localhost:3000/uploads/${data.image}`);
        }
      }
    } catch (error) {
      console.error("Gagal memuat profil desa", error);
      toast.error("Gagal memuat profil desa");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Nama Desa tidak boleh kosong";
    if (!formData.about.trim()) return "Tentang Desa tidak boleh kosong";
    if (!formData.vision.trim()) return "Visi tidak boleh kosong";
    if (!formData.mission.trim()) return "Misi tidak boleh kosong";
    if (!formData.address.trim()) return "Alamat tidak boleh kosong";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errorMsg = validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("about", formData.about);
      payload.append("vision", formData.vision);
      payload.append("mission", formData.mission);
      payload.append("address", formData.address);
      if (image) {
        payload.append("image", image);
      }

      if (profile && profile.id) {
        await axios.put(`http://localhost:3000/village-profile/${profile.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Profil desa berhasil diperbarui");
      } else {
        await axios.post("http://localhost:3000/village-profile", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Profil desa berhasil disimpan");
      }
      
      fetchProfile();
    } catch (error) {
      console.error("Gagal menyimpan profil", error);
      toast.error("Gagal menyimpan profil desa");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center p-10">
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-10">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">Profil Desa</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="col-span-1 md:col-span-2">
                <label className="mb-2 block font-medium text-gray-700">Foto Utama Desa</label>
                <div className="flex items-center gap-4">
                  {preview ? (
                    <div className="relative h-40 w-64 overflow-hidden rounded-lg border bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-40 w-64 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                      Belum ada foto
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="image-upload"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Pilih Foto Baru
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="mb-1 block font-medium text-gray-700">Nama Desa</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Masukkan nama desa"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="mb-1 block font-medium text-gray-700">Alamat Lengkap</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Masukkan alamat desa"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="mb-1 block font-medium text-gray-700">Tentang Desa</label>
                <textarea
                  name="about"
                  rows={4}
                  value={formData.about}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Deskripsi singkat tentang desa"
                ></textarea>
              </div>

              <div className="col-span-1">
                <label className="mb-1 block font-medium text-gray-700">Visi</label>
                <textarea
                  name="vision"
                  rows={4}
                  value={formData.vision}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Visi desa"
                ></textarea>
              </div>

              <div className="col-span-1">
                <label className="mb-1 block font-medium text-gray-700">Misi</label>
                <textarea
                  name="mission"
                  rows={4}
                  value={formData.mission}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Misi desa"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-blue-600 px-6 py-2 text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              >
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
