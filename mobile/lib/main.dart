import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/splash_screen.dart';
import 'services/news_service.dart';
import 'services/village_profile_service.dart';
import 'services/gallery_service.dart';
import 'services/umkm_service.dart';
import 'services/surat_service.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => NewsService()),
        ChangeNotifierProvider(create: (_) => VillageProfileService()),
        ChangeNotifierProvider(create: (_) => GalleryService()),
        ChangeNotifierProvider(create: (_) => UmkmService()),
        ChangeNotifierProvider(create: (_) => SuratService()),
      ],
      child: const DesakuDigitalApp(),
    ),
  );
}

class DesakuDigitalApp extends StatelessWidget {
  const DesakuDigitalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Desaku Digital',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1E3A5F),
          primary: const Color(0xFF1E3A5F),
        ),
        useMaterial3: true,
        fontFamily: 'Roboto',
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1E3A5F),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      home: const SplashScreen(),
    );
  }
}
