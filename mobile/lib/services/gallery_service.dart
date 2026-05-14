import 'package:flutter/foundation.dart';
import '../core/api_client.dart';
import '../models/gallery_model.dart';

class GalleryService extends ChangeNotifier {
  List<GalleryModel> _gallery = [];
  bool _isLoading = false;
  String? _error;

  List<GalleryModel> get gallery => _gallery;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchGallery() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiClient.dio.get('/gallery');
      _gallery = (response.data as List)
          .map((json) => GalleryModel.fromJson(json))
          .toList();
    } catch (e) {
      _error = 'Gagal memuat galeri. Periksa koneksi Anda.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
