import 'package:flutter/material.dart';
import '../utils/db_helper.dart';
import '../models/product.dart';
import 'db_management.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final TextEditingController _shoppingListController = TextEditingController();
  Map<String, List<String>> groupedList = {};

  final sectionOrder = [
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

  void _processShoppingList() async {
    final rawItems = _shoppingListController.text
        .split(',')
        .map((e) => e.trim())
        .where((e) => e.isNotEmpty)
        .toList();

    Map<String, List<String>> tempGrouped = {};

    for (var item in rawItems) {
      final product = await DatabaseHelper.instance.fuzzyGetProduct(item);
      final section = product?.section ?? 'Unknown';
      tempGrouped.putIfAbsent(section, () => []).add(item);
    }

    // sort sections by walking order
    final sortedKeys = tempGrouped.keys.toList()
      ..sort((a, b) {
        final aIndex = sectionOrder.indexOf(a);
        final bIndex = sectionOrder.indexOf(b);
        if (aIndex == -1 && bIndex == -1) return a.compareTo(b);
        if (aIndex == -1) return 1;
        if (bIndex == -1) return -1;
        return aIndex.compareTo(bIndex);
      });

    setState(() {
      groupedList = {for (var k in sortedKeys) k: tempGrouped[k]!};
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Shopping List"),
        actions: [
          IconButton(
            icon: Icon(Icons.edit),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => DatabaseManagementPage()),
              );
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _shoppingListController,
              decoration: InputDecoration(
                labelText: "Enter products (comma-separated)",
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 10),
            ElevatedButton(
              onPressed: _processShoppingList,
              child: Text("Organise List"),
            ),
            SizedBox(height: 20),
            Expanded(
              child: groupedList.isEmpty
                  ? Center(child: Text("Enter items to see grouped list"))
                  : ListView(
                      children: groupedList.entries.map((entry) {
                        return ExpansionTile(
                          title: Text(
                            entry.key,
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          children: entry.value
                              .map((item) => ListTile(title: Text(item)))
                              .toList(),
                        );
                      }).toList(),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
