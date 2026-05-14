import 'package:flutter/foundation.dart';
import '../core/api_client.dart';
import '../models/surat_model.dart';
import 'package:dio/dio.dart';

class SuratService extends ChangeNotifier {
  List<SuratModel> _surats = [];
  bool _isLoading = false;
  String? _error;

  List<SuratModel> get surats => _surats;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchSurats() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiClient.dio.get('/surat');
      _surats = (response.data as List)
          .map((json) => SuratModel.fromJson(json))
          .toList()
          .reversed
          .toList(); // Tampilkan yang terbaru di atas
    } catch (e) {
      _error = 'Gagal memuat riwayat pengajuan surat. Periksa koneksi Anda.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> submitSurat(Map<String, dynamic> data) async {
    try {
      await ApiClient.dio.post('/surat', data: data);
      await fetchSurats(); // Refresh data setelah berhasil
      return true;
    } catch (e) {
      if (e is DioException) {
        _error = e.response?.data['message'] ?? 'Gagal mengirim pengajuan.';
      } else {
        _error = 'Terjadi kesalahan sistem.';
      }
      return false;
    }
  }
}
