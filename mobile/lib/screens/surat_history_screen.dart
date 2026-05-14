import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/surat_service.dart';
import 'surat_form_screen.dart';
import 'surat_detail_screen.dart';

class SuratHistoryScreen extends StatefulWidget {
  const SuratHistoryScreen({super.key});

  @override
  State<SuratHistoryScreen> createState() => _SuratHistoryScreenState();
}

class _SuratHistoryScreenState extends State<SuratHistoryScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SuratService>().fetchSurats();
    });
  }

  Color _getStatusColor(String status) {
    final s = status.toUpperCase();
    if (s == 'SELESAI') return Colors.green;
    if (s == 'DITOLAK') return Colors.red;
    return Colors.orange;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E3A5F),
        title: const Text('Riwayat Pengajuan', style: TextStyle(color: Colors.white)),
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
      ),
      body: Consumer<SuratService>(
        builder: (context, service, _) {
          if (service.isLoading && service.surats.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }
          
          if (service.error != null && service.surats.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.wifi_off, size: 64, color: Colors.grey),
                  const SizedBox(height: 16),
                  Text(service.error!, style: const TextStyle(color: Colors.grey), textAlign: TextAlign.center),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: service.fetchSurats,
                    child: const Text('Coba Lagi'),
                  ),
                ],
              ),
            );
          }

          if (service.surats.isEmpty) {
            return RefreshIndicator(
              onRefresh: service.fetchSurats,
              child: ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  SizedBox(
                    height: MediaQuery.of(context).size.height * 0.6,
                    child: const Center(
                      child: Text('Belum ada riwayat pengajuan surat.'),
                    ),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: service.fetchSurats,
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: service.surats.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final item = service.surats[index];
                return InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => SuratDetailScreen(surat: item),
                      ),
                    );
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Card(
                    elevation: 1,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFF1E3A5F).withValues(alpha: 0.1),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.description_outlined, color: Color(0xFF1E3A5F)),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.jenis,
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '${item.createdAt.day}/${item.createdAt.month}/${item.createdAt.year}',
                                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: _getStatusColor(item.status).withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: _getStatusColor(item.status).withValues(alpha: 0.5)),
                            ),
                            child: Text(
                              item.status,
                              style: TextStyle(
                                color: _getStatusColor(item.status),
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const SuratFormScreen()),
          );
        },
        backgroundColor: const Color(0xFF1E3A5F),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
