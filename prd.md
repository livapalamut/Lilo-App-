# PRD: Lilo — Duygusal Karar Asistanı

**Versiyon:** 1.0  
**Tarih:** 31 Mart 2026  
**Durum:** Taslak  
**Hedef Kitle:** Yetişkinler (18+)

---

## 1. Ürün Özeti

**Lilo**, kullanıcıların yoğun duygusal anlarda dürtüsel kararlar almasını önlemek için tasarlanmış bir yapay zeka destekli web uygulamasıdır. Kullanıcı, hissettiği duyguyu ve vermek istediği kararı serbest metin olarak paylaşır; Lilo bu girdiyi analiz ederek bilişsel çarpıtmaları tespit eder ve kullanıcıyı kararın rasyonelliğini sorgulamaya yönlendiren, sakinleştirici bir dille hazırlanmış 3 soru sunar.

**Temel Değer Önerisi:** "Karar vermeden önce bir nefes al. Lilo seninle düşünsün."

---

## 2. Problem Tanımı

### 2.1 Kullanıcı Problemi

İnsanlar öfke, panik, derin üzüntü veya aşırı heyecan gibi yoğun duygusal anlarda karar alma kapasitelerinin önemli ölçüde düştüğünü fark etmezler. Bu anlarda:

- Felaketleştirme, ya hep ya hiç düşüncesi, okul zihniyeti gibi bilişsel çarpıtmalar devreye girer.
- Kararlar duygusal baskıyla alınır, sonrasında pişmanlık yaşanır.
- Bir terapist veya güvenilir bir dost her zaman erişilebilir değildir.

### 2.2 Mevcut Çözümlerin Eksikleri

| Alternatif | Eksiklik |
|---|---|
| Terapi / Koçluk | Pahalı, randevu gerektirir, anlık değil |
| Genel AI sohbet botları | Bağlamsal empati eksik; karar odaklı değil |
| Meditasyon uygulamaları | Karar sürecine doğrudan müdahil değil |
| Günlük / journaling uygulamaları | Geri bildirim sağlamaz |

---

## 3. Hedef Kullanıcı

### 3.1 Birincil Persona

**"Dürtüsel Karar Veren Yetişkin"**

- **Yaş:** 22–45  
- **Profil:** Kariyer, ilişki veya maddi konularda büyük kararlar vermek zorunda kalan, duygusal zeka geliştirmek isteyen bireyler.  
- **Davranış:** Stres altında hızlı karar verme eğiliminde, sonrasında pişmanlık yaşıyor.  
- **İhtiyaç:** Yargılanmadan düşüncelerini paylaşabileceği, anlık geri bildirim alacağı nötr bir alan.

### 3.2 İkincil Persona

**"Karar Erteleyici"**

- **Yaş:** 28–50  
- **Profil:** Karar vermekten korkan, anksiyete yaşayan bireyler.  
- **İhtiyaç:** Kararı netleştiren, adım adım sorgulayan bir yapı.

---

## 4. Ürün Kapsamı (v1.0)

### 4.1 Kapsam İçi (In Scope)

- Tek sayfalık web uygulaması (SPA)
- Serbest metin girişi (duygu + karar)
- Gemini API ile duygu analizi ve bilişsel çarpıtma tespiti
- Chat benzeri sonuç alanında sakinleştirici 3 soru gösterimi
- Responsive tasarım (mobil öncelikli)
- Oturum bazlı geçici bellek (sayfa yenilenmeden sürer)

### 4.2 Kapsam Dışı (Out of Scope — v1.0)

- Kullanıcı hesabı / kimlik doğrulama
- Geçmiş kayıtların saklanması
- Sesli giriş / çıkış
- Çoklu dil desteği
- Push bildirimleri
- Mobil native uygulama

---

## 5. Fonksiyonel Gereksinimler

### 5.1 Ekran 1 — Giriş Ekranı

| # | Gereksinim | Öncelik |
|---|---|---|
| F-01 | Kullanıcı, tek bir metin alanına duygu durumunu ve kararını birlikte yazabilir. | P0 |
| F-02 | Metin alanının altında açıklayıcı bir placeholder metni bulunur (örn: "Şu an ne hissediyorsun ve ne yapmak istiyorsun?"). | P0 |
| F-03 | "Lilo'ya Sor" butonu metin alanı doluyken aktif hale gelir; boşken disabled görünür. | P0 |
| F-04 | Buton tıklandığında yükleme animasyonu gösterilir, metin alanı ve buton devre dışı kalır. | P0 |
| F-05 | Minimum karakter sınırı: 20; maksimum: 1000. Sınır dışı girişlerde kullanıcı bilgilendirilir. | P1 |
| F-06 | Uygulama adı, tagline ve kısa bir açıklama giriş ekranında görünür. | P1 |

### 5.2 Ekran 2 — Sonuç Alanı (Chat Benzeri)

| # | Gereksinim | Öncelik |
|---|---|---|
| F-07 | Kullanıcının girişi "kullanıcı balonu" olarak gösterilir. | P0 |
| F-08 | Lilo'nun yanıtı "asistan balonu" olarak, sırayla akış şeklinde (streaming) görüntülenir. | P0 |
| F-09 | Yanıt yapısı şunları içerir: (a) Duygu özeti, (b) Tespit edilen bilişsel çarpıtmalar (varsa), (c) 3 yönlendirici soru. | P0 |
| F-10 | Her soru, ayrı bir balonda ya da numaralı liste olarak belirgin şekilde sunulur. | P1 |
| F-11 | Yanıt tamamlandıktan sonra "Yeniden Başla" butonu belirir. | P0 |
| F-12 | Kullanıcı her soruya yazılı yanıt verebilir; Lilo bu yanıtları dikkate alarak kısa bir kapanış mesajı üretir. | P2 |

### 5.3 AI Davranışı — Prompt Mühendisliği Kuralları

| # | Kural | Detay |
|---|---|---|
| AI-01 | **Ton:** Sakinleştirici, yargılamayan, empatik. Direktif vermez. | Örn: "Seni anlıyorum, bu çok zor bir an..." |
| AI-02 | **Duygu Tespiti:** Kullanıcının yazdığı metindeki baskın duyguyu etiketler (öfke, korku, üzüntü, heyecan, vb.). | |
| AI-03 | **Bilişsel Çarpıtma Tespiti:** Aşağıdaki çarpıtmaları tanır ve adını koyar: Felaketleştirme, Ya Hep Ya Hiç, Zihin Okuma, Duygusal Akıl Yürütme, Aşırı Genelleme, Olumsuza Odaklanma. | |
| AI-04 | **Sorular:** 3 soru mutlaka açık uçlu olmalı, evet/hayır ile cevaplanamaz. | Örn: "Bu kararı 6 ay sonra değerlendirdiğinde ne düşünürsün?" |
| AI-05 | **Karar Vermez:** Lilo asla "şunu yap" veya "yapma" demez. | |
| AI-06 | **Kriz Durumu:** Metinde intihar, zarar verme gibi anahtar kelimeler tespit edilirse, yanıt öncesinde kriz hattı bilgisi gösterilir ve analiz yapılmaz. | |
| AI-07 | **Kısa Yanıt:** Toplam yanıt 300 kelimeyi geçmemeli. | |

---

## 6. Non-Fonksiyonel Gereksinimler

| Kategori | Gereksinim |
|---|---|
| **Performans** | İlk anlamlı yanıt (FMP) ≤ 2 saniye; tam yanıt streaming ile ≤ 8 saniye |
| **Güvenlik** | API anahtarı yalnızca backend/env üzerinde tutulur, client'a açılmaz |
| **Gizlilik** | Kullanıcı metinleri sunucuda saklanmaz (stateless); gizlilik politikası footer'da belirtilir |
| **Erişilebilirlik** | WCAG 2.1 AA uyumu; ekran okuyucu desteği; yeterli renk kontrastı |
| **Ölçeklenebilirlik** | Gemini API rate limit yönetimi; istek başına hata yönetimi |
| **Tarayıcı Desteği** | Chrome, Firefox, Safari, Edge (son 2 versiyon); mobil tarayıcılar |

---

## 7. Teknik Mimari (Önerilen)

```
┌─────────────────────────────────┐
│         Frontend (SPA)          │
│   React + Tailwind CSS          │
│   Framer Motion (animasyon)     │
└────────────────┬────────────────┘
                 │ HTTPS
┌────────────────▼────────────────┐
│      Backend / Edge Function    │
│   Next.js API Route / Vercel    │
│   Prompt hazırlama + Gemini     │
│   API çağrısı (server-side)     │
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│         Google Gemini API       │
│   Model: gemini-1.5-flash       │
│   Streaming: SSE                │
└─────────────────────────────────┘
```

**Önerilen Stack:**

| Katman | Teknoloji |
|---|---|
| Frontend | React 18, Next.js 14 (App Router) |
| Stil | Tailwind CSS + CSS Variables |
| Animasyon | Framer Motion |
| AI | Google Gemini 1.5 Flash (streaming) |
| Deploy | Vercel |
| Ortam Değişkeni | `.env.local` → `GEMINI_API_KEY` |

---

## 8. UX / Tasarım Prensipleri

### 8.1 Görsel Dil

- **Ton:** Sakin, güvenli, doğal. Klinik değil; sıcak ama profesyonel.
- **Renk Paleti:** Toprak tonları veya soft mavi/yeşil; yüksek kontrast değil, göz yormayan.
- **Tipografi:** Yumuşak, okunabilir serif veya rounded sans-serif.
- **İkonografi:** Minimal; gereksiz dekorasyon yok.
- **Boşluk:** Bol beyaz alan; yoğunluk hissi yaratmamak.

### 8.2 Kullanıcı Akışı

```
Açılış Ekranı
    │
    ▼
Metin Girişi → [Lilo'ya Sor]
    │
    ▼
Yükleme Animasyonu ("Lilo düşünüyor...")
    │
    ▼
Chat Alanı: Kullanıcı balonu → Lilo yanıtı (streaming)
    │
    ├── (v1.0) → [Yeniden Başla]
    │
    └── (v2.0) → Kullanıcı sorulara yanıt verir → Kapanış mesajı
```

### 8.3 Mikro Etkileşimler

- Yazma sırasında karakter sayacı
- Streaming yanıt sırasında yazma efekti (cursor blink)
- Lilo avatarı veya simgesi yanıt gelirken pulse animasyonu

---

## 9. İçerik Kılavuzu

### 9.1 Uygulama Metinleri (Copywriting)

| Öğe | Metin |
|---|---|
| **Tagline** | "Karar vermeden önce bir nefes al." |
| **Placeholder** | "Şu an ne hissediyorsun ve ne yapmak istiyorsun? Her şeyi yaz, burada güvendesin." |
| **Buton** | "Lilo'ya Sor" |
| **Yükleme** | "Lilo seninle düşünüyor..." |
| **Hata** | "Şu an yanıt üretemiyorum. Lütfen biraz sonra tekrar dene." |
| **Kriz Uyarısı** | "Yazdıkların beni endişelendirdi. Lütfen şu anda bir uzmana ulaş: [182 — İntihar Önleme Hattı]" |

### 9.2 Örnek Prompt Şablonu (Sistem Mesajı)

```
Sen Lilo adında empatik bir duygusal karar asistanısın. Görevin:
1. Kullanıcının duygu durumunu kısa ve nazikçe özetle.
2. Varsa bilişsel çarpıtmaları (felaketleştirme, ya hep ya hiç, vb.) adını koyarak nazikçe belirt.
3. Kullanıcının kararını daha net görmesine yardımcı olacak, açık uçlu 3 soru sor.

Kurallar:
- Asla "şunu yap" veya "yapma" deme.
- Yargılama, eleştiri, ders verme.
- Tonu her zaman sakin, sıcak ve güvenli tut.
- Yanıtın 300 kelimeyi geçmesin.
- Türkçe yaz.
```

---

## 10. Metrikler ve Başarı Kriterleri

| Metrik | Hedef (İlk 3 Ay) |
|---|---|
| Haftalık aktif kullanıcı (WAU) | 500+ |
| Oturum başına ortalama analiz sayısı | ≥ 1.5 |
| Hata oranı (API hatası) | < %2 |
| Kullanıcı memnuniyeti (anket, 1-5) | ≥ 4.0 |
| Ortalama yanıt süresi | ≤ 6 sn |
| "Yeniden Başla" kullanım oranı | ≥ %30 (bağlılık göstergesi) |

---

## 11. Riskler ve Azaltma Stratejileri

| Risk | Olasılık | Etki | Azaltma |
|---|---|---|---|
| Kriz durumunda yetersiz yönlendirme | Düşük | Kritik | AI-06 kuralı; keyword filtresi; hukuki inceleme |
| Gemini API kesintisi | Orta | Yüksek | Hata mesajı + retry mantığı |
| Kullanıcıların yanıtları gerçek terapi yerine görmesi | Orta | Yüksek | Açık disclaimer: "Bu bir terapi hizmeti değildir." |
| Kişisel veri endişesi | Düşük | Orta | Stateless mimari; gizlilik politikası |
| Prompt injection saldırıları | Düşük | Orta | Input sanitizasyonu; sistem prompt'u sağlamlaştırma |

---

## 12. Yasal ve Etik Notlar

- Uygulama bir **terapi veya tıbbi hizmet değildir**; bu bilgi footer'da ve ilk açılışta açıkça belirtilir.
- Kriz durumlarında kullanıcı mutlaka profesyonel yardım kaynaklarına yönlendirilir.
- Kullanıcı verileri işlenmeden önce **açık rıza** alınır (KVKK uyumu).
- AI yanıtları için **sorumluluk reddi beyanı** hazırlanır.

---

## 13. Yayın Planı

| Aşama | Süre | Çıktı |
|---|---|---|
| **Faz 1 — MVP** | 2 hafta | Giriş ekranı + Gemini entegrasyonu + temel sonuç alanı |
| **Faz 2 — Polishing** | 1 hafta | Animasyonlar, hata yönetimi, kriz filtresi, responsive |
| **Faz 3 — Beta** | 2 hafta | 50 beta kullanıcı, geri bildirim toplama |
| **Faz 4 — v1.0 Launch** | 1 hafta | Public deploy, analytics entegrasyonu |

---

## 14. Açık Sorular

1. Gemini mi, Claude API mi tercih edilecek? (Maliyet ve Türkçe performans karşılaştırması yapılmalı)
2. Kullanıcıdan e-posta toplama gerekiyor mu? (Waitlist / bildirim için)
3. Mobil uygulama (React Native) ne zaman kapsama alınacak?
4. Freemium modeli planlanıyor mu? (Aylık ücretsiz analiz kotası)
5. Kriz yönlendirmesinde hangi Türkiye'ye özel kaynaklar kullanılacak?

---

*Bu PRD yaşayan bir belgedir. Ürün geliştikçe güncellenmelidir.*  
*Son güncelleme: 31 Mart 2026*
