import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/surat_service.dart';

class SuratFormScreen extends StatefulWidget {
  const SuratFormScreen({super.key});

  @override
  State<SuratFormScreen> createState() => _SuratFormScreenState();
}

class _SuratFormScreenState extends State<SuratFormScreen> {
  final _formKey = GlobalKey<FormState>();
  
  final _namaController = TextEditingController();
  final _nikController = TextEditingController();
  final _keperluanController = TextEditingController();
  
  String _selectedJenis = 'Surat Domisili';
  final List<String> _jenisSuratOptions = [
    'Surat Domisili',
    'Surat Usaha',
    'Surat Keterangan',
  ];

  bool _isSubmitting = false;

  @override
  void dispose() {
    _namaController.dispose();
    _nikController.dispose();
    _keperluanController.dispose();
    super.dispose();
  }

  void _submitForm() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isSubmitting = true;
      });

      final data = {
        'nama': _namaController.text.trim(),
        'nik': _nikController.text.trim(),
        'jenis': _selectedJenis,
        'keperluan': _keperluanController.text.trim(),
      };

      final service = context.read<SuratService>();
      final success = await service.submitSurat(data);

      setState(() {
        _isSubmitting = false;
      });

      if (mounted) {
        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Pengajuan surat berhasil dikirim!'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pop(context); // Kembali ke riwayat
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(service.error ?? 'Gagal mengirim pengajuan'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text('Buat Pengajuan', style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFF1E3A5F),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Mohon isi data dengan lengkap dan benar sesuai identitas Anda.',
                style: TextStyle(color: Colors.black54, fontSize: 14),
              ),
              const SizedBox(height: 24),
              
              // NAMA
              TextFormField(
                controller: _namaController,
                decoration: InputDecoration(
                  labelText: 'Nama Lengkap',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  filled: true,
                  fillColor: Colors.white,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Nama tidak boleh kosong';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // NIK
              TextFormField(
                controller: _nikController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'NIK (16 Digit)',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  filled: true,
                  fillColor: Colors.white,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'NIK tidak boleh kosong';
                  if (value.trim().length != 16) return 'NIK harus 16 digit';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // JENIS SURAT
              DropdownButtonFormField<String>(
                value: _selectedJenis,
                decoration: InputDecoration(
                  labelText: 'Jenis Surat',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  filled: true,
                  fillColor: Colors.white,
                ),
                items: _jenisSuratOptions.map((jenis) {
                  return DropdownMenuItem(
                    value: jenis,
                    child: Text(jenis),
                  );
                }).toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _selectedJenis = value;
                    });
                  }
                },
              ),
              const SizedBox(height: 16),

              // KEPERLUAN
              TextFormField(
                controller: _keperluanController,
                maxLines: 4,
                decoration: InputDecoration(
                  labelText: 'Keperluan',
                  alignLabelWithHint: true,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  filled: true,
                  fillColor: Colors.white,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Keperluan tidak boleh kosong';
                  return null;
                },
              ),
              const SizedBox(height: 32),

              // SUBMIT BUTTON
              SizedBox(
                height: 50,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _submitForm,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1E3A5F),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: _isSubmitting
                      ? const SizedBox(
                          height: 24,
                          width: 24,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Text('Kirim Pengajuan', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
