import 'package:flutter/material.dart';

ThemeData darkTheme = ThemeData(
  brightness: Brightness.dark,
  primaryColor: Colors.deepPurple,
  colorScheme: ColorScheme.fromSeed(
    seedColor: Colors.deepPurple,
    brightness: Brightness.dark,
  ),
  appBarTheme: AppBarTheme(
    backgroundColor: Colors.deepPurple,
    foregroundColor: Colors.white,
  ),
  scaffoldBackgroundColor: Colors.black,
  textTheme: TextTheme(
    // bodyText1: TextStyle(color: Colors.white),
    // bodyText2: TextStyle(color: Colors.white70),
  ),
);