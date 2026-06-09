# 7fil Deploy Kılavuzu

## Gerekli GitHub Secrets

### API (Railway)
| Secret | Açıklama |
|--------|----------|
| `RAILWAY_TOKEN` | Railway CLI token (railway.app → Account Settings → Tokens) |

### Web + Partner Portal (Vercel)
| Secret | Açıklama |
|--------|----------|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel team/org ID |
| `VERCEL_PROJECT_ID_WEB` | web-7fil Vercel project ID |
| `VERCEL_PROJECT_ID_PARTNER` | partner-portal Vercel project ID |

### Mobil (EAS)
| Secret | Açıklama |
|--------|----------|
| `EXPO_TOKEN` | Expo account token (expo.dev → Access Tokens) |

## Ortamlar

| Uygulama | Platform | URL |
|----------|----------|-----|
| API | Railway | `https://api.7fil.com.tr` |
| Web | Vercel | `https://7fil.com.tr` |
| Partner | Vercel | `https://partner.7fil.com.tr` |
| DB | Railway (PostgreSQL+PostGIS) | Internal |
| Storage | Cloudflare R2 | `https://media.7fil.com.tr` |

## İlk Deploy Adımları

### 1. Railway — API + DB
```bash
# Railway CLI kur
npm i -g @railway/cli
railway login

# Proje oluştur
railway new 7fil-production

# PostgreSQL (PostGIS) ekle
railway add --plugin postgresql

# DB init
railway connect postgresql
psql < apps/api/db/init.sql

# API deploy
railway up --service 7fil-api
```

### 2. Vercel — Web
```bash
# Vercel CLI kur
npm i -g vercel
cd apps/web-7fil
vercel --prod
```

### 3. Vercel — Partner Portal
```bash
cd apps/partner-portal
vercel --prod
```

### 4. EAS Build — Mobil
```bash
npm i -g eas-cli
cd apps/mobile
eas build --platform all --profile production
eas submit --platform all
```

## CI/CD Akışı

```
Push to main
    │
    ├── CI: typecheck + build  (her PR)
    ├── CI: api-test (DB ile)  (her PR)
    │
    └── Deploy (yalnızca main)
            ├── deploy-api    → Railway
            ├── deploy-web    → Vercel
            ├── deploy-partner→ Vercel
            └── eas-build     → EAS (commit mesajında [mobile] varsa)
```

## Environment Variables

API'ye `.env` dosyası olarak veya Railway dashboard üzerinden ekle:
- `DATABASE_URL`
- `JWT_SECRET` (256 bit rastgele)
- `REFRESH_TOKEN_SECRET`
- `ANTHROPIC_API_KEY`
- `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_MODE=production`
- `RESEND_API_KEY`
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
- `API_BASE_URL=https://api.7fil.com.tr/api/v1`
- `FRONTEND_URL=https://7fil.com.tr`
