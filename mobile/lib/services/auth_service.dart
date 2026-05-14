import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import '../core/api_client.dart';

class AuthService extends ChangeNotifier {
  String? _token;
  String? _name;
  String? _role;
  bool _isLoading = false;
  String? _error;

  String? get token => _token;
  String? get name => _name;
  String? get role => _role;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _token != null;

  /// Membaca token yang tersimpan di SharedPreferences saat aplikasi dibuka
  Future<void> checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
    _name = prefs.getString('name');
    _role = prefs.getString('role');
    if (_token != null) {
      ApiClient.setToken(_token!);
    }
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiClient.dio.post('/auth/login', data: {
        'email': email.trim(),
        'password': password,
      });

      final data = response.data;
      _token = data['access_token'];
      _name = data['name'];
      _role = data['role'];

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', _token!);
      if (_name != null) await prefs.setString('name', _name!);
      if (_role != null) await prefs.setString('role', _role!);

      // Update ApiClient interceptor dengan token baru
      ApiClient.setToken(_token!);

      notifyListeners();
      return true;
    } on DioException catch (e) {
      final statusCode = e.response?.statusCode;
      if (statusCode == 401) {
        _error = 'Email atau password salah';
      } else {
        _error = 'Gagal login. Periksa koneksi Anda.';
      }
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> register(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await ApiClient.dio.post('/auth/register', data: {
        'name': name.trim(),
        'email': email.trim(),
        'password': password,
      });
      notifyListeners();
      return true;
    } on DioException catch (e) {
      final msg = e.response?.data?['message'];
      _error = msg is String ? msg : 'Email sudah digunakan atau terjadi kesalahan.';
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _token = null;
    _name = null;
    _role = null;
    ApiClient.clearToken();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('name');
    await prefs.remove('role');
    notifyListeners();
  }
}
