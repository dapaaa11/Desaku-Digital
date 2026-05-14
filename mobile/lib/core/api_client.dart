import 'package:dio/dio.dart';
import 'constants.dart';

class ApiClient {
  static Dio? _dio;

  static Dio get dio {
    _dio ??= Dio(BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {'Content-Type': 'application/json'},
    ));

    // Request/Response logging (hapus di production)
    _dio!.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));

    return _dio!;
  }

  /// Membuat instance Dio baru dengan Authorization header JWT
  static Dio authorizedDio(String token) {
    final authorizedClient = Dio(BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    ));
    return authorizedClient;
  }
}
