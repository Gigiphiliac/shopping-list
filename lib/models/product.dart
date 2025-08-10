class Product {
  final int? id;
  final String name;
  final String section;

  Product({this.id, required this.name, required this.section});

  Map<String, dynamic> toMap() {
    return {'id': id, 'name': name, 'section': section};
  }

  factory Product.fromMap(Map<String, dynamic> map) {
    return Product(id: map['id'], name: map['name'], section: map['section']);
  }
}
