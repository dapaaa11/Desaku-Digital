import 'package:dio/dio.dart';
import 'constants.dart';

class ApiClient {
  static Dio? _dio;
  static String? _token;

  static Dio get dio {
    _dio ??= Dio(BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
    ));

    _dio!.interceptors.clear();

    // Interceptor: Otomatis menyematkan JWT token jika tersedia
    _dio!.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        if (_token != null) {
          options.headers['Authorization'] = 'Bearer $_token';
        }
        options.headers['Content-Type'] = 'application/json';
        return handler.next(options);
      },
    ));

    return _dio!;
  }

  static void setToken(String token) {
    _token = token;
    _dio = null; // Reset so interceptor picks up new token
  }

  static void clearToken() {
    _token = null;
    _dio = null;
  }
}
