import 'package:flutter/foundation.dart';
import '../core/api_client.dart';
import '../models/village_profile_model.dart';

class VillageProfileService extends ChangeNotifier {
  VillageProfileModel? _profile;
  bool _isLoading = false;
  String? _error;

  VillageProfileModel? get profile => _profile;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchProfile() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiClient.dio.get('/village-profile');
      final data = response.data;
      if (data is List && data.isNotEmpty) {
        _profile = VillageProfileModel.fromJson(data[0]);
      } else if (data is Map<String, dynamic>) {
        _profile = VillageProfileModel.fromJson(data);
      }
    } catch (e) {
      _error = 'Gagal memuat profil desa. Periksa koneksi Anda.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
