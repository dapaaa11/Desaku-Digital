class UmkmModel {
  final int id;
  final String name;
  final String description;
  final String whatsapp;
  final String address;
  final String? image;

  UmkmModel({
    required this.id,
    required this.name,
    required this.description,
    required this.whatsapp,
    required this.address,
    this.image,
  });

  factory UmkmModel.fromJson(Map<String, dynamic> json) {
    return UmkmModel(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      whatsapp: json['whatsapp'],
      address: json['address'],
      image: json['image'],
    );
  }
}
