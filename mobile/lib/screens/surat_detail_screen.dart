import 'package:flutter/material.dart';
import '../models/surat_model.dart';

class SuratDetailScreen extends StatelessWidget {
  final SuratModel surat;

  const SuratDetailScreen({super.key, required this.surat});

  Color _getStatusColor(String status) {
    final s = status.toUpperCase();
    if (s == 'SELESAI') return Colors.green;
    if (s == 'DITOLAK') return Colors.red;
    return Colors.orange; // Default: Diproses / DIPROSES
  }

  IconData _getStatusIcon(String status) {
    final s = status.toUpperCase();
    if (s == 'SELESAI') return Icons.check_circle;
    if (s == 'DITOLAK') return Icons.cancel;
    return Icons.pending_actions;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text('Detail Pengajuan', style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFF1E3A5F),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Status Card
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    Icon(
                      _getStatusIcon(surat.status),
                      color: _getStatusColor(surat.status),
                      size: 40,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Status Pengajuan',
                            style: TextStyle(fontSize: 14, color: Colors.grey),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            surat.status.toUpperCase(),
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: _getStatusColor(surat.status),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Detail Card
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Informasi Dokumen',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1E3A5F),
                      ),
                    ),
                    const Divider(height: 24),
                    _buildInfoRow('Jenis Surat', surat.jenis),
                    const SizedBox(height: 12),
                    _buildInfoRow('Tanggal Pengajuan', 
                      '${surat.createdAt.day}/${surat.createdAt.month}/${surat.createdAt.year}'),
                    const SizedBox(height: 12),
                    _buildInfoRow('Keperluan', surat.keperluan),
                    const Divider(height: 32),
                    const Text(
                      'Data Pemohon',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1E3A5F),
                      ),
                    ),
                    const Divider(height: 24),
                    _buildInfoRow('Nama Lengkap', surat.nama),
                    const SizedBox(height: 12),
                    _buildInfoRow('Nomor Induk Kependudukan (NIK)', surat.nik),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
      ],
    );
  }
}
