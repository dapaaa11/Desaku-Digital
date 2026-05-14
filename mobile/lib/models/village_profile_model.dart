class VillageProfileModel {
  final int id;
  final String name;
  final String about;
  final String vision;
  final String mission;
  final String address;
  final String? image;

  VillageProfileModel({
    required this.id,
    required this.name,
    required this.about,
    required this.vision,
    required this.mission,
    required this.address,
    this.image,
  });

  factory VillageProfileModel.fromJson(Map<String, dynamic> json) {
    return VillageProfileModel(
      id: json['id'],
      name: json['name'],
      about: json['about'],
      vision: json['vision'],
      mission: json['mission'],
      address: json['address'],
      image: json['image'],
    );
  }
}
