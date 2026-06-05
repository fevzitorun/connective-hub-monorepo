"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { LISTINGS } from '@/lib/data';
import {
  IconSearch, IconSparkle, IconArrowRight,
  IconRobot, IconScale, IconCoin, IconShield, IconLayer, IconCompass,
  BrandSilhouette,
} from '@/components/icons';
import { RitualStrip, ListingCard } from '@/components/ui';
import type { Listing } from '@/lib/data';

const Stat = ({ num, label }: { num: string; label: string }) => (
  <div className="stat">
    <div className="stat-num">{num}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const FCard = ({ icon: I, title, text }: { icon: React.ComponentType<{ [key: string]: unknown }>; title: string; text: string }) => (
  <div className="fcard">
    <div className="fcard-icon"><I/></div>
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

export default function HomeScreen() {
  const router = useRouter();
  const featured = LISTINGS.slice(0, 4);

  const handleOpenListing = (l: Listing) => {
    router.push(`/ilanlar/${l.id}`);
  };

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-watermark" aria-hidden="true">
          <BrandSilhouette color="rgba(201,168,76,0.55)"/>
        </div>
        <div className="hero-inner">
          <span className="eyebrow hero-eyebrow">Connective Hub Dijital Teknolojiler</span>
          <h1>Evin için <em>doğru adım.</em><br/>Yedi adımda.</h1>
          <p className="hero-sub">
            7fil; arama, değerleme, hukuki doğrulama, finansman, sigorta, imza ve taşınma —
            ev sahibi olmanın yedi adımını tek çatı altında birleştiren entegre gayrimenkul ekosistemidir.
          </p>

          <div className="hero-search" role="search">
            <IconSearch/>
            <input placeholder="Doğal dilde sor: &quot;Kadıköy'de metroya 5 dk, balkonlu 3+1&quot;"/>
            <div className="hero-search-divider"/>
            <select className="hero-search-select" defaultValue="satilik">
              <option value="satilik">Satılık</option>
              <option value="kiralik">Kiralık</option>
            </select>
            <button className="hero-aimode">
              <IconSparkle size={12}/> Atlas AI
            </button>
            <button className="btn btn-primary btn-sm" style={{height:40, padding:'0 18px'}}>Ara</button>
          </div>

          <div className="hero-chips">
            {['İstanbul', 'Kadıköy', 'Beşiktaş', 'Şişli', 'İzmir · Alaçatı', 'Bodrum · Yalıkavak', 'Ankara · Çankaya'].map(c => (
              <button key={c} className="hero-chip">{c}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <section className="section-ink" style={{padding:0}}>
        <div className="stats-row" style={{maxWidth:1320, margin:'0 auto'}}>
          <Stat num="124.500" label="Aktif İlan"/>
          <Stat num="3.840" label="Onaylı Ajans"/>
          <Stat num="98K +" label="Kayıtlı Kullanıcı"/>
          <Stat num="₺2,4 T" label="Yıllık İşlem Hacmi"/>
        </div>
      </section>

      {/* ── 7 Adım ─────────────────────────────────────────────── */}
      <section className="section section-tight" style={{paddingTop:80, paddingBottom:40}}>
        <RitualStrip activeStep={2}/>
      </section>

      {/* ── Featured listings ──────────────────────────────────── */}
      <section className="section section-tight">
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow-gold">Öne Çıkan İlanlar</span>
            <h2>Ajanslarımızın bu hafta <em>seçtikleri.</em></h2>
            <p className="section-head-sub">
              Senior danışman ekibimiz tarafından elenmiş, Atlas AI değerlemesi tamamlanmış ilanlar.
            </p>
          </div>
          <button className="btn btn-outline" onClick={() => router.push('/ilanlar')}>
            Tüm ilanlar <IconArrowRight size={16}/>
          </button>
        </div>
        <div className="cards-grid">
          {featured.map(l => <ListingCard key={l.id} l={l} onOpen={handleOpenListing}/>)}
        </div>
      </section>

      {/* ── Features grid (dark) ───────────────────────────────── */}
      <section className="section-ink">
        <div className="section-inner">
          <div className="section-head">
            <div>
              <span className="eyebrow" style={{color:'var(--gold)'}}>Platform</span>
              <h2>Tek çatı altında <em>her şey.</em></h2>
              <p className="section-head-sub">
                Bir ev almak; arama, değerleme, hukuki incelemenin yanı sıra finansman, sigorta ve taşınma da içerir.
                7fil bu süreci bir yerden yönetilebilir hale getirir.
              </p>
            </div>
          </div>
          <div className="fgrid">
            <FCard icon={IconRobot} title="Atlas AI Asistan"
                   text="Doğal dil sorgu, mahalle raporu, fiyat tahmini. Claude tarafından desteklenir, prompt cache ile çalışır."/>
            <FCard icon={IconScale} title="Hukuki Doğrulama"
                   text="Tapu, ipotek, imar — sertifikalı avukat ağı tarafından 0–100 risk skoru ile incelenir."/>
            <FCard icon={IconCoin} title="Mortgage & Katılım"
                   text="BDDK limitleri, faizli ve faizsiz seçenekler, banka başvurusu tek tıkla."/>
            <FCard icon={IconShield} title="Depozito Güvence"
                   text="Kiracı depozitosu avukat onaylı escrow'da bekler. Hasar varsa puanlı iade akışı çalışır."/>
            <FCard icon={IconLayer} title="MLS Komisyon Paylaşımı"
                   text="Türkiye'nin ilk MLS modeli. İlanı paylaşan ve satan ajans komisyonu otomatik böler."/>
            <FCard icon={IconCompass} title="Mülk Sağlık Skoru"
                   text="6 ayda bir kontrol, fotoğraf karşılaştırma, FILTERRA.AI ile 0–100 sağlık skoru."/>
          </div>
        </div>
      </section>

      {/* ── Editorial closing ──────────────────────────────────── */}
      <section className="section section-tight" style={{paddingTop:96, paddingBottom:120}}>
        <div style={{maxWidth:920, margin:'0 auto', textAlign:'center'}}>
          <span className="eyebrow eyebrow-gold">7 Fil Ritüeli</span>
          <p className="display" style={{fontSize:'clamp(28px, 3.4vw, 44px)', fontWeight:400, lineHeight:1.25, marginTop:14, color:'var(--ink)'}}>
            &ldquo;Hortumu yukarıya dönük fil bereket getirir; yedi fil ise yeni bir kapının
            açılışına eşlik eder. Biz bu inancı, ev sahibi olmanın
            <em style={{color:'var(--gold-deep)', fontStyle:'italic'}}> yedi adımına </em>
            taşıdık.&rdquo;
          </p>
          <div style={{marginTop:24, color:'var(--muted)', fontSize:13, letterSpacing:'0.14em', textTransform:'uppercase'}}>
            Connective Hub Dijital Teknolojiler Ltd. Şti.
          </div>
        </div>
      </section>
    </>
  );
}
