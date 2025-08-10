import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/product.dart';
import 'package:fuzzywuzzy/fuzzywuzzy.dart';

extension StringNormalize on String {
  String normalize() {
    var text = trim().toLowerCase();
    if (text.endsWith('es')) {
      text = text.substring(0, text.length - 2);
    } else if (text.endsWith('s')) {
      text = text.substring(0, text.length - 1);
    }
    return text;
  }
}

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('products.db');
    return _database!;
  }

  Future<Database> _initDB(String fileName) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, fileName);
    return await openDatabase(path, version: 1, onCreate: _createDB);
  }

  Future _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE products(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        section TEXT NOT NULL
      )
    ''');
  }

  Future<int> insertProduct(Product product) async {
    final db = await instance.database;
    return await db.insert(
      'products',
      product.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<Product>> fetchProducts() async {
    final db = await instance.database;
    final result = await db.query('products');
    return result.map((map) => Product.fromMap(map)).toList();
  }

  Future<Product?> getProductByName(String name) async {
    final db = await instance.database;
    final result = await db.query(
      'products',
      where: 'LOWER(name) = ?',
      whereArgs: [name.toLowerCase()],
    );
    if (result.isNotEmpty) {
      return Product.fromMap(result.first);
    }
    return null;
  }

  Future<int> deleteProduct(int id) async {
    final db = await instance.database;
    return await db.delete('products', where: 'id = ?', whereArgs: [id]);
  }

  Future<int> updateProduct(Product product) async {
    final db = await instance.database;
    return await db.update(
      'products',
      product.toMap(),
      where: 'id = ?',
      whereArgs: [product.id],
    );
  }

  Future<Product?> fuzzyGetProduct(String query, {int threshold = 80}) async {
    final db = await instance.database;
    final products = await fetchProducts();

    final normalizedQuery = query.normalize();

    // First try exact normalized match
    for (var p in products) {
      if (p.name.normalize() == normalizedQuery) {
        return p;
      }
    }

    // Otherwise fuzzy match
    Product? bestMatch;
    int bestScore = 0;

    for (var p in products) {
      final score = ratio(p.name.toLowerCase(), query.toLowerCase());
      if (score > bestScore) {
        bestScore = score;
        bestMatch = p;
      }
    }

    if (bestScore >= threshold) {
      return bestMatch;
    }
    return null;
  }
}
