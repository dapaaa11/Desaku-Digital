import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/village_profile_service.dart';
import '../core/constants.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<VillageProfileService>().fetchProfile();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E3A5F),
        title: const Text('Profil Desa', style: TextStyle(color: Colors.white)),
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
      ),
      body: Consumer<VillageProfileService>(
        builder: (context, service, _) {
          if (service.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (service.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.wifi_off, size: 64, color: Colors.grey),
                  const SizedBox(height: 16),
                  Text(service.error!, style: const TextStyle(color: Colors.grey)),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: service.fetchProfile,
                    child: const Text('Coba Lagi'),
                  ),
                ],
              ),
            );
          }
          if (service.profile == null) {
            return const Center(child: Text('Profil desa belum tersedia.'));
          }
          final profile = service.profile!;
          return SingleChildScrollView(
            child: Column(
              children: [
                // Header with image
                Stack(
                  children: [
                    if (profile.image != null)
                      Image.network(
                        '${AppConstants.uploadsUrl}/${profile.image}',
                        width: double.infinity,
                        height: 200,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(height: 200, color: const Color(0xFF1E3A5F)),
                      )
                    else
                      Container(
                        height: 200,
                        color: const Color(0xFF1E3A5F),
                        child: const Center(child: Icon(Icons.account_balance, size: 80, color: Colors.white)),
                      ),
                    Positioned(
                      bottom: 0,
                      left: 0,
                      right: 0,
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              const Color(0xFF1E3A5F).withValues(alpha: 0.9),
                            ],
                          ),
                        ),
                        child: Text(
                          profile.name,
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                // Content
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      _InfoSection(title: 'Tentang Desa', content: profile.about, icon: Icons.info_outline),
                      _InfoSection(title: 'Visi', content: profile.vision, icon: Icons.visibility_outlined),
                      _InfoSection(title: 'Misi', content: profile.mission, icon: Icons.flag_outlined),
                      _InfoSection(title: 'Alamat', content: profile.address, icon: Icons.location_on_outlined),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _InfoSection extends StatelessWidget {
  final String title;
  final String content;
  final IconData icon;

  const _InfoSection({required this.title, required this.content, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              Icon(icon, size: 20, color: const Color(0xFF1E3A5F)),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1E3A5F))),
            ]),
            const Divider(height: 16),
            Text(content, style: const TextStyle(fontSize: 14, color: Colors.black87, height: 1.5)),
          ],
        ),
      ),
    );
  }
}
