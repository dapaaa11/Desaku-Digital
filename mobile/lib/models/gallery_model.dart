class GalleryModel {
  final int id;
  final String? title;
  final String image;
  final DateTime createdAt;

  GalleryModel({
    required this.id,
    this.title,
    required this.image,
    required this.createdAt,
  });

  factory GalleryModel.fromJson(Map<String, dynamic> json) {
    return GalleryModel(
      id: json['id'],
      title: json['title'],
      image: json['image'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}
