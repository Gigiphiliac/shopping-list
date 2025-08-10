import 'package:flutter/material.dart';
import '../utils/db_helper.dart';
import '../models/product.dart';

class DatabaseManagementPage extends StatefulWidget {
  @override
  _DatabaseManagementPageState createState() => _DatabaseManagementPageState();
}

class _DatabaseManagementPageState extends State<DatabaseManagementPage> {
  List<Product> products = [];
  final sections = [
    'Produce',
    'Bakery',
    'Deli',
    'Grocery',
    'Frozen',
    'International',
    'Household',
    'Beverages',
    'Health & Beauty',
    'Other',
  ];

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  void _loadProducts() async {
    final data = await DatabaseHelper.instance.fetchProducts();
    setState(() {
      products = data;
    });
  }

  void _showProductDialog({Product? product}) {
    final nameController = TextEditingController(text: product?.name ?? "");
    String? selectedSection = product?.section;

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(product == null ? 'Add Product' : 'Edit Product'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              decoration: InputDecoration(labelText: "Product Name"),
            ),
            DropdownButtonFormField<String>(
              value: selectedSection,
              hint: Text("Select Section"),
              items: sections
                  .map((sec) => DropdownMenuItem(value: sec, child: Text(sec)))
                  .toList(),
              onChanged: (val) => selectedSection = val,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text("Cancel"),
          ),
          ElevatedButton(
            onPressed: () async {
              if (nameController.text.isNotEmpty && selectedSection != null) {
                if (product == null) {
                  await DatabaseHelper.instance.insertProduct(
                    Product(
                      name: nameController.text,
                      section: selectedSection!,
                    ),
                  );
                } else {
                  await DatabaseHelper.instance.updateProduct(
                    Product(
                      id: product.id,
                      name: nameController.text,
                      section: selectedSection!,
                    ),
                  );
                }
                Navigator.pop(context);
                _loadProducts();
              }
            },
            child: Text("Save"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Manage Products")),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showProductDialog(),
        child: Icon(Icons.add),
      ),
      body: ListView.builder(
        itemCount: products.length,
        itemBuilder: (_, i) {
          final p = products[i];
          return ListTile(
            title: Text(p.name),
            subtitle: Text(p.section),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  icon: Icon(Icons.edit),
                  onPressed: () => _showProductDialog(product: p),
                ),
                IconButton(
                  icon: Icon(Icons.delete, color: Colors.red),
                  onPressed: () async {
                    await DatabaseHelper.instance.deleteProduct(p.id!);
                    _loadProducts();
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
