# NestJS Authentication API

Bu proje, JWT tabanlı authentication sistemi içeren bir NestJS backend uygulamasıdır.

## 🚀 Özellikler

- ✅ Kullanıcı Kaydı (Register)
- ✅ Kullanıcı Girişi (Login)
- ✅ JWT Token Authentication
- ✅ Password Hashing (bcrypt)
- ✅ PostgreSQL Database
- ✅ TypeORM
- ✅ Validation (class-validator)
- ✅ CORS Support

## 📋 Gereksinimler

- Node.js (v16 veya üzeri)
- Docker & Docker Compose (PostgreSQL için)
- npm veya yarn

## 🛠️ Kurulum ve Çalıştırma

### Adım 1: Bağımlılıkları Yükleyin

```bash
npm install
```

### Adım 2: Environment Variables Ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

`.env` dosyası şu şekilde olmalıdır:

```env
# Server
PORT=3169

# Database
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=myuser
DB_PASSWORD=mypassword
DB_DATABASE=mydatabase

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=1d
```

**ÖNEMLİ:** Port 5433 kullanılıyor çünkü 5432 portu sistemde zaten kullanımda olabilir.

### Adım 3: PostgreSQL Veritabanını Başlatın

Docker Compose ile PostgreSQL'i başlatın:

```bash
docker-compose up -d
```

Veritabanının hazır olduğunu kontrol edin:

```bash
docker ps
```

`my-big-be-projects-db-1` container'ının çalıştığını görmelisiniz.

### Adım 4: Uygulamayı Çalıştırın

Development modunda çalıştırın:

```bash
npm run start:dev
```

Uygulama başarıyla başladığında şu mesajı göreceksiniz:

```
Application is running on: http://localhost:3169
Swagger documentation: http://localhost:3169/api
```

## 📡 API Endpoints

### 1. Kullanıcı Kaydı (Register)

**POST** `/auth/register`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 2. Kullanıcı Girişi (Login)

**POST** `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 3. Profil Bilgisi (Protected Route)

**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "userId": "uuid",
  "email": "user@example.com"
}
```

## 🧪 Test Etme

### cURL ile Test

#### Register:
```bash
curl -X POST http://localhost:3169/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3169/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Profile (Token ile):
```bash
curl -X GET http://localhost:3169/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 📁 Proje Yapısı

```
src/
├── auth/
│   ├── dto/
│   │   └── login.dto.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/
│   ├── dto/
│   │   └── create-user.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.module.ts
│   └── users.service.ts
├── app.module.ts
└── main.ts
```

## 🔒 Güvenlik Notları

- Production'da `JWT_SECRET` değerini mutlaka değiştirin
- `synchronize: true` ayarını production'da `false` yapın
- HTTPS kullanın
- Rate limiting ekleyin
- Environment variables'ı güvenli bir şekilde saklayın

## 🛑 Veritabanını Durdurma

```bash
docker-compose down
```

Veritabanı verilerini de silmek için:
```bash
docker-compose down -v
```

## 📝 Notlar

- Şifreler bcrypt ile hashlenmiştir (10 rounds)
- JWT token'lar varsayılan olarak 1 gün geçerlidir
- Email adresleri unique olmalıdır
- Tüm endpoint'ler validation kullanır
