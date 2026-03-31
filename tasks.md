# Tasks — Lilo (v1.0 adım adım geliştirme)

## Faz 1 — MVP (2 hafta)

1. Proje iskeleti kurulumunu tamamla (Next.js 14 App Router + React 18 + Tailwind + Framer Motion); doğrulama: `npm run dev` açılıyor, temel sayfa görüntüleniyor.
2. UI tasarım temellerini ekle (renk paleti, tipografi, spacing, layout); doğrulama: giriş ekranı mock tasarımı “benzer” görünümde.
3. Ortam değişkenlerini hazırla (`.env.local` → `GEMINI_API_KEY`) ve client’a sızmayı engelle; doğrulama: API anahtarı sadece backend tarafında okunuyor.
4. Giriş ekranı alanlarını uygula (tagline, uygulama kısa açıklaması, tek metin girişi); doğrulama: placeholder ve metin alanı çalışıyor.
5. Karakter sınırı doğrulaması ekle (`min 20`, `max 1000`); doğrulama: sınır dışı durumda kullanıcı bilgilendiriliyor.
6. “Lilo'ya Sor” buton durumlarını uygula (metin boşsa disabled, doluyken aktif; tıklayınca loading, input+buton devre dışı); doğrulama: F-03/F-04 davranışları tutarlı.
7. Basit yükleme animasyonu ve hata kopyasını ekle (“Lilo seninle düşünüyor...”, “Şu an yanıt üretemiyorum...”); doğrulama: ağ gecikmesi simüle edilince akış görülüyor.
8. Backend API route oluştur (Next.js API Route / Server Action); doğrulama: request alıyor ve uygun response döndürüyor.
9. Prompt mühendisliği kural setini sistem prompt içinde uygula (ton, 3 açık uçlu soru zorunluluğu, 300 kelime limiti, “şunu yap/yapma” yasağı); doğrulama: model yanıtı format kurallarına uyuyor.
10. Gemini entegrasyonunu streaming ile yap (SSE yaklaşımı); doğrulama: UI streaming gösteriyor, ilk anlamlı yanıt FMP ≤ 2 sn hedefi gözleniyor (pratik test).
11. Yanıt işleme + chat benzeri UI’yi kur
   - Kullanıcı balonu (girdi) ve asistan balonu (streaming) bileşenlerini ekle
   - Yanıt yapısını göster: (a) duygu özeti, (b) tespit edilen bilişsel çarpıtmalar (varsa), (c) 3 soru; doğrulama: F-07–F-10 karşılanıyor.
12. “Yeniden Başla” akışını ekle (son yanıt bitince görünür, state temizliği); doğrulama: yeni oturum F-11’e uygun.
13. Kritik güvenlik davranışı ekle (kriz keyword tespiti: intihar/zarar verme); doğrulama: kriz algılanınca analiz yapılmadan kriz hattı bilgisi gösteriliyor (AI-06).
14. Basit prompt injection önlemleri al (girdi sanitizasyonu + sistem prompt’u öncelikli kılacak yapı); doğrulama: baseline saldırı senaryolarında sistem prompt devre dışı kalmıyor.

## Faz 2 — Polishing (1 hafta)

1. Mikro etkileşimleri ekle (streaming sırasında yazma efekti/cursor blink, avatar/pulse); doğrulama: davranışlar tutarlı ve performansı bozmaz.
2. Animasyonları ve sayfa geçişlerini iyileştir (Framer Motion); doğrulama: animasyonlar “akıcı” ve UX’i destekliyor.
3. Responsive düzeni tamamla (mobil öncelik); doğrulama: temel akış (giriş → sonuç) mobilde sorunsuz.
4. Performans ve hata yönetimini güçlendir (retry mantığı, timeouts, kullanıcıya net geri bildirim); doğrulama: API hatası < %2 hedefi için ölçümleme yapılabiliyor.
5. Kriz filtresi doğruluğunu artır (keyword kapsamını genişletmek + sınır durumlar); doğrulama: yanlış pozitif/negatif dengesi iyileşiyor.
6. WCAG 2.1 AA gereksinimlerini karşılamak için temel kontrolleri uygula (odak yönetimi, kontrast, ekran okuyucu etiketleri); doğrulama: erişilebilirlik kontrolleri “geçiyor” seviyesinde.
7. Privacy & etik metinleri ekle
   - Terapinin yerini tutmadığı disclaimer
   - “Kullanıcı verileri işlenmeden önce açık rıza” bilgilendirmesi
   - Gizlilik politikası (footer); doğrulama: içerikler ekranda görünür.
8. (v1.0) Kullanıcı sorulara yazılı yanıt verme akışını hazırla (F-12); doğrulama: soruların her biri için yanıt alan UI var ve modelin kapanış mesajı üretiyor.

## Faz 3 — Beta (2 hafta)

1. 50 beta kullanıcı için yönetilebilir bir geri bildirim toplama mekanizması kur (ör. oturum sonrası kısa anket / loglama); doğrulama: memnuniyet (1-5) verisi toplanıyor.
2. Kullanım akışını iyileştir (ergonomi, boş durumlar, yönlendirme metinleri); doğrulama: “Yeniden Başla” kullanım oranı gözlemlenebilir.
3. Gemini rate limit yönetimi + server-side korumayı finalize et; doğrulama: yoğun kullanımda çökmeler azalıyor.
4. Analitik temel ölçümleri ekle (WAU, oturum/analiz sayısı, hata oranı, ortalama yanıt süresi); doğrulama: metrikler pratikte görünür.

## Faz 4 — v1.0 Launch (1 hafta)

1. Prod deploy’ı tamamla (Vercel önerilir); doğrulama: prod ortamında `.env.local` ayarları düzgün çalışıyor.
2. Analitik entegrasyonunu genişlet ve metrik hedeflerini izleyebilir hale getir; doğrulama: hedefler (WAU ≥ 500, hata oranı < %2, ortalama yanıt ≤ 6 sn) takip ediliyor.
3. Kriz yönlendirmesi ve disclaimer metinlerini son haline getir (Türkiye’ye özel kaynaklar için PRD Açık Sorular’a göre); doğrulama: kriz senaryosunda doğru metin gösteriliyor.
4. Son QA ve manuel senaryo doğrulamaları
   - Boş/az/çok metin girişleri
   - Streaming boyunca sayfa yenileme davranışı (oturum bazlı bellek v1.0 kapsamına uygun)
   - API kesintisi/timeout senaryosu
   - Engelli kullanıcı akışları (temel); doğrulama: kritik senaryolar sorunsuz.

## Tanım (DoD) — “MVP hazır” sayılma kriteri

1. Giriş ekranı gereksinimleri (F-01..F-06) tamamen çalışıyor.
2. Sonuç alanı gereksinimleri (F-07..F-11) streaming ile uyumlu çalışıyor.
3. Sistem prompt + yanıt kısıtları (AI-01..AI-07) uygulanmış durumda.
4. Kriz keyword tespiti (AI-06) UI tarafında doğru aksiyon alıyor.
5. API anahtarı sadece backend/env tarafında ve prod deploy edilebilir.
