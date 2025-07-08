# 🔍 SERP Sıralama Kontrol Uygulaması

Bu uygulama, bir web sitesinin (domain) belirli bir anahtar kelime (keyword) için Google’daki organik sıralamasını kontrol etmeye yarar. Uygulama, [SerpApi](https://serpapi.com/) üzerinden veri çeker ve sonuçları kullanıcı dostu bir arayüzde listeler. Ayrıca geçmiş sorgular kaydedilir ve sıralama grafiği olarak gösterilir.

## 🚀 Canlı Demo

👉 [Uygulamayı Görüntüle](https://my-serp-app-p8y3.vercel.app/)

## 🛠️ Kullanılan Teknolojiler

- **Next.js (App Router)**
- **TypeScript**
- **Bootstrap 5** (responsive arayüz)
- **Chart.js** (grafik gösterimi)
- **SerpApi** (Google arama sonuçları API)
- **LocalStorage** (sorgu geçmişi)

## 📦 Kurulum

Projeyi klonladıktan sonra:

```bash
git clone https://github.com/niluse/my-serp-app.git
cd serp-app
npm install
```

### .env.local dosyası

Aşağıdaki gibi `.env.local` dosyasını oluşturun:

```env
SERP_API_KEY=senin_serpapi_anahtarin
```

## ▶️ Uygulamayı Başlatma

```bash
npm run dev
```

Tarayıcıda şu adresi aç: [http://localhost:3000](http://localhost:3000)

## ⚙️ Özellikler

### 🔍 Arama İşlevi

- Domain ve anahtar kelime girerek sorgulama yapılabilir.
- İlk 50 sonuç arasında verilen domain varsa sıralaması gösterilir.
- Domain sonuçlarda yoksa "Bulunamadı" mesajı verilir.

### 📊 Grafiksel Gösterim

- Google’daki ilk 50 organik sonucu gösteren bar chart.
- Kullanıcının domaini farklı renkle vurgulanır.

### 🕓 Geçmiş

- Son 10 arama geçmişi LocalStorage'da saklanır.
- Sayfa yenilense bile geçmiş korunur.

### ⚠️ Hata Yönetimi

- Eksik alanlarda uyarı verir.
- API hatalarında kullanıcı bilgilendirilir.

## 🧪 Geliştirici Notları

- `Bootstrap` ile hızlı ve sade UI sağlandı.
- Grafikler `Chart.js` ile dinamik şekilde güncelleniyor.
- `localStorage` üzerinden geçmiş yönetimi sağlandı.
- API tarafında Next.js API route kullanıldı (`/api/serp`), bu endpoint SerpApi’ye proxy görevi görür.

## 📁 Dosya Yapısı (Özet)

```bash
├── components
│   ├── History.tsx
│   ├── RankingChart.tsx
│   ├── ResultTable.tsx
│   ├── SearchForm.tsx
│   └── ErrorAlert.tsx
├── pages
│   └── api
│       └── serp.ts       # SerpApi proxy handler
├── app
│   └── page.tsx          # Ana sayfa bileşeni
├── public
├── styles
├── .env.local
├── package.json
└── README.md
```

## 📌 Geliştirici Notu

Bu uygulama, SEO analizleri ve rakip sıralama kontrolleri için sade ve kullanıcı dostu bir araç olarak geliştirilmiştir. Özellikle küçük işletmelerin veya freelancerların hızlıca pozisyonlarını takip etmesi için uygundur.

## 📄 Lisans

MIT Lisansı
