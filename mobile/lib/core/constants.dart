// Konfigurasi terpusat URL backend
class AppConstants {
  // Gunakan 10.0.2.2 untuk Android Emulator (alias localhost)
  // Ganti dengan IP jaringan lokal jika menggunakan perangkat fisik
  static const String baseUrl = const String.fromEnvironment('API_URL', defaultValue: 'http://10.0.2.2:3000');
  static const String uploadsUrl = '$baseUrl/uploads';
}
