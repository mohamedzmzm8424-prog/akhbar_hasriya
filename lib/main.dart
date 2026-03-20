import 'package:flutter/material.dart';
import 'dart:async';

void main() => runApp(const AkhbarHasriyaApp());

class AkhbarHasriyaApp extends StatelessWidget {
  const AkhbarHasriyaApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'أخبار حصرية',
      theme: ThemeData(primarySwatch: Colors.red),
      home: const NewsHomeScreen(),
    );
  }
}

class NewsHomeScreen extends StatefulWidget {
  const NewsHomeScreen({super.key});
  @override
  State<NewsHomeScreen> createState() => _NewsHomeScreenState();
}

class _NewsHomeScreenState extends State<NewsHomeScreen> {
  final List<String> categories = const [
    'أخبار عاجلة', 'سياسة', 'رياضة', 'اقتصاد', 'فن', 
    'تكنولوجيا', 'حوادث', 'ثقافة', 'منوعات', 'عالمي'
  ];

  // دالة وهمية لتحديث الأخبار (سيتم ربطها بالمحرك الفعلي)
  Future<void> refreshNews() async {
    await Future.delayed(const Duration(seconds: 2));
    print("تم تحديث الأخبار من المحرك المجاني");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('أخبار حصرية'), centerTitle: true),
      body: RefreshIndicator(
        onRefresh: refreshNews,
        child: Column(
          children: [
            // شريط عاجل
            Container(
              color: Colors.black,
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: const Center(
                child: Text('🔴 عاجل: الأخبار تتحدث تلقائياً كل 30 دقيقة', 
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
            // الأقسام الـ 10
            Expanded(
              child: ListView.builder(
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  return Card(
                    margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    child: ListTile(
                      leading: const Icon(Icons.rss_feed, color: Colors.red),
                      title: Text(categories[index]),
                      trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
