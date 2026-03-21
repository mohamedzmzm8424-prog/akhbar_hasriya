import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, SafeAreaView, ScrollView, 
  TouchableOpacity, Image, FlatList, TextInput, ActivityIndicator 
} from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('ar');
  const [aiMode, setAiMode] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // تحديث الأخبار تلقائياً كل ساعة من مصادر عالمية مفتوحة
  const fetchNews = async () => {
    try {
      const res = await fetch('https://ok.surf/api/v1/cors/news-feed');
      const data = await res.json();
      setNews(data.Arabic || data.World);
    } catch (e) { 
      console.log("خطأ في الاتصال بالأخبار"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 3600000); // تحديث كل ساعة
    return () => clearInterval(interval);
  }, []);

  // وظيفة المساعد الذكي للرد على الأسئلة
  const askAI = async () => {
    if (!userInput) return;
    setIsAiLoading(true);
    setAiResponse('');
    try {
      // محرك ذكاء اصطناعي للرد الفوري ومفتوح
      const response = await fetch(`https://api.duckduckgo.com/?q=${userInput}&format=json&no_html=1`);
      const data = await response.json();
      setAiResponse(data.AbstractText || (lang === 'ar' ? "أنا معك يا فنان، كيف يمكنني مساعدتك أكثر في تطبيقك؟" : "I'm here to help, what else do you need?"));
    } catch (e) { 
      setAiResponse(lang === 'ar' ? "عذراً، حدث خطأ في الاتصال بالخادم" : "Connection error"); 
    } finally { 
      setIsAiLoading(false); 
    }
  };

  const labels = {
    ar: { title: "أخبار حصرية", aiTitle: "المساعد الذكي", breaking: "عاجل", home: "الرئيسية", ask: "اسأل المساعد الذكي..", send: "إرسال" },
    en: { title: "Exclusive News", aiTitle: "AI Assistant", breaking: "Breaking", home: "Home", ask: "Ask AI Assistant..", send: "Send" }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* الهيدر العلوي */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
          <Text style={styles.langBtn}>{lang === 'ar' ? 'English' : 'عربي'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{aiMode ? labels[lang].aiTitle : labels[lang].title}</Text>
        <TouchableOpacity onPress={() => setAiMode(!aiMode)}>
          <Ionicons name={aiMode ? "newspaper-outline" : "chatbubble-ellipses-outline"} size={28} color="#e63946" />
        </TouchableOpacity>
      </View>

      {!aiMode ? (
        <View style={{flex:1}}>
          {/* شريط الأخبار العاجلة المتحرك */}
          <View style={styles.breakingBar}>
            <View style={styles.breakingTag}><Text style={{color:'#fff', fontWeight:'bold'}}>{labels[lang].breaking}</Text></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.breakingText}>{news.length > 0 ? news[0].title : "جارٍ جلب الأخبار العاجلة..."}</Text>
            </ScrollView>
          </View>

          {loading ? <ActivityIndicator size="large" color="#e63946" style={{marginTop:50}}/> :
          <FlatList
            data={news}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={[styles.card, { flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }]}>
                <Image source={{ uri: item.og || 'https://via.placeholder.com/150' }} style={styles.cardImg} />
                <View style={styles.cardContent}>
                  <Text style={styles.sourceText}>{item.source}</Text>
                  <Text style={[styles.newsTitle, {textAlign: lang === 'ar' ? 'right' : 'left'}]} numberOfLines={2}>{item.title}</Text>
                  <TouchableOpacity onPress={() => Speech.speak(item.title, {language: lang === 'ar' ? 'ar-SA' : 'en-US'})} style={styles.listenBtn}>
                    <Ionicons name="volume-high" size={22} color="#e63946" />
                    <Text style={{fontSize:12, color:'#e63946', marginLeft:5}}>استماع</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />}
        </View>
      ) : (
        // واجهة المساعد الذكي
        <View style={styles.aiBox}>
          <ScrollView style={{flex:1, marginBottom: 10}}>
            <View style={styles.aiReplyBox}>
              <Text style={styles.aiReplyText}>{aiResponse || labels[lang].ask}</Text>
            </View>
            {isAiLoading && <ActivityIndicator color="#e63946" />}
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput 
              style={styles.input} 
              placeholder={labels[lang].ask} 
              value={userInput} 
              onChangeText={setUserInput} 
            />
            <TouchableOpacity style={styles.send} onPress={askAI}>
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* شريط التنقل السفلي */}
      <View style={styles.bottomNav}>
         <TouchableOpacity onPress={() => setAiMode(false)} style={styles.navItem}>
            <Ionicons name="home" size={26} color={!aiMode ? "#e63946" : "#999"}/>
            <Text style={{fontSize:10, color: !aiMode ? "#e63946" : "#999"}}>{labels[lang].home}</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => setAiMode(true)} style={styles.navItem}>
            <Ionicons name="chatbubbles" size={26} color={aiMode ? "#e63946" : "#999"}/>
            <Text style={{fontSize:10, color: aiMode ? "#e63946" : "#999"}}>AI</Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', alignItems: 'center', elevation: 3 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#e63946' },
  langBtn: { fontWeight: 'bold', color: '#444' },
  breakingBar: { flexDirection: 'row', backgroundColor: '#333', padding: 8, alignItems: 'center' },
  breakingTag: { backgroundColor: '#e63946', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 5, marginRight: 10 },
  breakingText: { color: '#fff', fontSize: 14 },
  card: { margin: 10, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 2 },
  cardImg: { width: 110, height: 110 },
  cardContent: { flex: 1, padding: 12, justifyContent: 'space-between' },
  sourceText: { color: '#e63946', fontWeight: 'bold', fontSize: 11 },
  newsTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 5 },
  listenBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  aiBox: { flex: 1, padding: 15 },
  aiReplyBox: { backgroundColor: '#fff', padding: 15, borderRadius: 15, borderLeftWidth: 5, borderLeftColor: '#e63946' },
  aiReplyText: { fontSize: 16, color: '#333', lineHeight: 24 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  input: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 25, borderWidth: 1, borderColor: '#ddd' },
  send: { backgroundColor: '#e63946', padding: 12, borderRadius: 25, marginLeft: 10 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  navItem: { alignItems: 'center' }
});
