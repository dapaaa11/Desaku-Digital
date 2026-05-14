import 'package:flutter/foundation.dart';
import '../core/api_client.dart';
import '../models/umkm_model.dart';

class UmkmService extends ChangeNotifier {
  List<UmkmModel> _umkms = [];
  bool _isLoading = false;
  String? _error;

  List<UmkmModel> get umkms => _umkms;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchUmkms() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiClient.dio.get('/umkm');
      _umkms = (response.data as List)
          .map((json) => UmkmModel.fromJson(json))
          .toList();
    } catch (e) {
      _error = 'Gagal memuat data UMKM. Periksa koneksi Anda.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
