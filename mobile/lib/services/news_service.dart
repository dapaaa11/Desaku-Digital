import 'package:flutter/foundation.dart';
import '../core/api_client.dart';
import '../models/news_model.dart';

class NewsService extends ChangeNotifier {
  List<NewsModel> _news = [];
  bool _isLoading = false;
  String? _error;

  List<NewsModel> get news => _news;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchNews() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiClient.dio.get('/news');
      _news = (response.data as List)
          .map((json) => NewsModel.fromJson(json))
          .toList();
    } catch (e) {
      _error = 'Gagal memuat berita. Periksa koneksi Anda.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
