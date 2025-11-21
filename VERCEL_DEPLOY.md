# Vercel Deployment Rehberi

## Gereksinimler

1. Vercel hesabı
2. GitHub repository'ye push edilmiş proje
3. PostgreSQL veritabanı (Vercel Postgres veya external database)

## Adım 1: Vercel'e Proje Ekle

1. [Vercel Dashboard](https://vercel.com/dashboard) 'a git
2. "Add New Project" butonuna tıkla
3. GitHub repository'ni seç
4. Import et

## Adım 2: Environment Variables Ayarla

Vercel Dashboard'da projenin Settings > Environment Variables bölümüne git ve şunları ekle:

### Database Variables
```
DB_HOST=your-database-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database-name
```

**Veya PostgreSQL Connection String kullanıyorsan:**
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### JWT Variables
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1d
```

### Server Variables
```
PORT=3000
NODE_ENV=production
```

## Adım 3: Build Settings

Vercel otomatik olarak algılayacak, ama kontrol et:

- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Adım 4: Database Seçenekleri

### Seçenek 1: Vercel Postgres (Önerilen)
1. Vercel Dashboard'da projenin Storage sekmesine git
2. "Create Database" > "Postgres" seç
3. Database oluştur
4. Connection string'i environment variable olarak ekle

### Seçenek 2: External Database (Supabase, Railway, vb.)
- Database provider'dan connection string'i al
- `DATABASE_URL` veya ayrı ayrı `DB_HOST`, `DB_PORT`, vb. ekle

## Adım 5: Deploy

1. "Deploy" butonuna tıkla
2. Build loglarını kontrol et
3. Deployment tamamlandığında URL'yi al

## Önemli Notlar

1. **Synchronize:** Production'da `synchronize: false` yap (migrations kullan)
2. **CORS:** Production'da `origin: true` yerine spesifik domain'ler ekle
3. **Logging:** Production'da `logging: false` yapabilirsin
4. **Environment Variables:** Tüm environment variable'ları Vercel'e ekle

## Troubleshooting

### Build Hatası
- `npm run build` komutunu local'de test et
- `dist` klasörünün oluştuğundan emin ol

### Database Connection Hatası
- Environment variable'ların doğru olduğundan emin ol
- Database'in public network'ten erişilebilir olduğundan emin ol
- SSL connection gerekebilir (TypeORM config'e `ssl: true` ekle)

### 404 Hatası
- `vercel.json` dosyasının doğru olduğundan emin ol
- `api/index.ts` dosyasının mevcut olduğundan emin ol

## Production Checklist

- [ ] Environment variables eklendi
- [ ] Database bağlantısı test edildi
- [ ] `synchronize: false` yapıldı
- [ ] CORS origin'leri güncellendi
- [ ] JWT_SECRET değiştirildi
- [ ] Logging production için optimize edildi

