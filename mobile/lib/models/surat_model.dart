class SuratModel {
  final int id;
  final String nama;
  final String nik;
  final String jenis;
  final String keperluan;
  final String status;
  final DateTime createdAt;

  SuratModel({
    required this.id,
    required this.nama,
    required this.nik,
    required this.jenis,
    required this.keperluan,
    required this.status,
    required this.createdAt,
  });

  factory SuratModel.fromJson(Map<String, dynamic> json) {
    return SuratModel(
      id: json['id'],
      nama: json['nama'],
      nik: json['nik'],
      jenis: json['jenis'],
      keperluan: json['keperluan'],
      status: json['status'] ?? 'Diproses',
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'nama': nama,
      'nik': nik,
      'jenis': jenis,
      'keperluan': keperluan,
    };
  }
}
