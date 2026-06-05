"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LISTINGS, fmtTRY } from '@/lib/data';
import { IconCompass, IconSparkle, IconSend, IconKebab } from '@/components/icons';
import { Photo } from '@/components/photos';
import type { Listing } from '@/lib/data';

interface ScriptMessage {
  from: 'ai' | 'user';
  text: React.ReactNode;
  listings?: string[];
}

const SCRIPT: ScriptMessage[] = [
  { from: 'ai', text: (
    <>
      <p>İyi günler. Bugün nasıl bir ev arıyoruz?</p>
      <p style={{color:'var(--muted)', fontSize:14}}>İsterseniz konuşma dilinde anlatın — bütçe, çocuk var mı, ofisiniz nerede gibi. Filtre kutucuklarını doldurmaktan daha hızlı olacaktır.</p>
    </>
  ) },
  { from: 'user', text: <p>Kadıköy&apos;de metroya yakın, balkonlu 3+1 daire arıyorum. Bütçem en fazla 9 milyon.</p> },
  { from: 'ai', text: (
    <>
      <p>Anladım. Aradığınızı şöyle yorumladım — yanlış bir şey varsa söyleyin:</p>
      <ul style={{margin:'8px 0 12px 16px', padding:0, color:'var(--ink)', fontSize:14, lineHeight:1.8}}>
        <li>İlçe: <strong>Kadıköy</strong> — Caferağa, Moda, Fenerbahçe çevresi</li>
        <li>3+1, en az bir balkon, metroya 5–10 dakika yürüme</li>
        <li>Üst sınır: <strong>9 milyon ₺</strong></li>
      </ul>
      <p>Atlas AI bu kriterlere uyan <strong>2 ilan</strong> buldu. Bölgede ortalamadan iyi konumlananları öne aldım:</p>
    </>
  ), listings: ['l1', 'l6'] },
  { from: 'ai', text: (
    <>
      <p style={{fontStyle:'italic', color:'var(--muted)', fontSize:14, marginTop:8}}>
        Küçük bir not — Moda&apos;daki ilan piyasa ortalamasının %4 altında. Acele bir karar şart değil; ama bu fiyat aralığında genellikle iki hafta içinde satılıyor.
      </p>
    </>
  ) },
  { from: 'user', text: <p>Moda&apos;daki için ne dersin? Yıllık değer artışı ne kadardı?</p> },
  { from: 'ai', text: (
    <>
      <p>Moda&apos;nın son <strong>12 aylık</strong> ortalama fiyat değişimi <strong>+%8,3</strong>. Aynı dönemde Kadıköy genelinde <strong>+%7,1</strong>; Caferağa <strong>+%9,4</strong>. Yani Moda, çevreden hafifçe geride — bu da iki türlü yorumlanabilir:</p>
      <p style={{paddingLeft:14, borderLeft:'2px solid var(--gold)', color:'var(--ink)', fontSize:14}}>
        <strong>İyimser:</strong> bölge henüz tepe yapmadı, alım için iyi pencere.<br/>
        <strong>Temkinli:</strong> Caferağa&apos;da yapılaşma artıyor; uzun vadede Moda&apos;nın görünürlük avantajı korunmayabilir.
      </p>
      <p>Ben olsam görmeden karar vermem; ama dosya hazırlatmaya değer. İsterseniz sertifikalı avukat ağımız tapu ve imar kontrolünü 48 saatte tamamlayabilir.</p>
    </>
  ) },
];

export default function AtlasScreen() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [visible] = useState(SCRIPT.length);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({behavior:'smooth'}); }, [visible]);

  const handleOpenListing = (l: Listing) => {
    router.push(`/ilanlar/${l.id}`);
  };

  return (
    <div className="atlas-page">
      {/* Sidebar */}
      <aside className="atlas-side">
        <div className="atlas-side-head">
          <div className="atlas-side-mark">
            <IconCompass/>
          </div>
          <div>
            <div className="atlas-side-title">Atlas AI</div>
            <div className="atlas-side-sub">FILTERRA.AI Powered</div>
          </div>
        </div>

        <div className="atlas-side-section">
          <div className="atlas-side-section-label">Bu Hafta</div>
          <div className="atlas-thread" data-active="true">
            Kadıköy&apos;de 3+1 araması
            <div className="atlas-thread-time">Bugün · 10:24</div>
          </div>
          <div className="atlas-thread">
            Levent ofis kira analizi
            <div className="atlas-thread-time">Dün · 15:08</div>
          </div>
          <div className="atlas-thread">
            Çeşme yazlık değerleme
            <div className="atlas-thread-time">21 Mayıs</div>
          </div>
        </div>

        <div className="atlas-side-section">
          <div className="atlas-side-section-label">Önceki</div>
          <div className="atlas-thread">Galata tarihi apartman riski</div>
          <div className="atlas-thread">Mortgage karşılaştırma</div>
          <div className="atlas-thread">DASK ve yangın sigortası</div>
        </div>

        <div className="atlas-side-section" style={{marginTop:'auto'}}>
          <button className="btn btn-outline btn-sm" style={{width:'100%'}}>+ Yeni Konuşma</button>
        </div>
      </aside>

      {/* Main */}
      <main className="atlas-main">
        <header className="atlas-main-head">
          <div>
            <h2>Kadıköy&apos;de 3+1 araması</h2>
            <div className="atlas-main-status">çevrimiçi</div>
          </div>
          <div style={{marginLeft:'auto', display:'flex', gap:8}}>
            <span className="pill pill-line" style={{height:24, fontSize:11}}>
              <IconSparkle size={12}/> claude-sonnet-4
            </span>
            <button className="btn btn-ghost btn-sm">
              <IconKebab size={16}/>
            </button>
          </div>
        </header>

        <div className="atlas-chat">
          {SCRIPT.slice(0, visible).map((m, i) => (
            <div key={i} className="msg" data-from={m.from}>
              <div className="msg-avatar">
                {m.from === 'ai' ? <IconCompass/> : 'ZA'}
              </div>
              <div>
                <div className="msg-bubble">
                  {m.text}
                  {m.listings && (
                    <div className="msg-listings">
                      {m.listings.map(id => {
                        const l = LISTINGS.find(x => x.id === id);
                        if (!l) return null;
                        return (
                          <div key={id} className="msg-listing" onClick={() => handleOpenListing(l)}>
                            <div className="msg-listing-photo">
                              <Photo scene={l.scene} palette={l.palette}/>
                            </div>
                            <div style={{minWidth:0}}>
                              <div className="msg-listing-title">{l.title}</div>
                              <div className="msg-listing-meta">{l.district} · {l.area} m² · {l.rooms}</div>
                            </div>
                            <div className="msg-listing-price">{fmtTRY(l.price)}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={endRef}/>
        </div>

        <div className="atlas-suggest">
          <div className="atlas-suggest-row">
            {[
              'Tapu kontrolü başlat',
              'Avukat ata',
              'Mortgage karşılaştır',
              'PDF broşür hazırla',
              'Benzer ilanları göster',
            ].map(s => (
              <button key={s} className="atlas-suggest-chip">{s}</button>
            ))}
          </div>
        </div>

        <div className="atlas-input">
          <div className="atlas-input-inner">
            <textarea
              rows={1}
              placeholder="Atlas AI'a bir şey sor…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="atlas-send" aria-label="Gönder">
              <IconSend/>
            </button>
          </div>
          <div style={{maxWidth:820, margin:'10px auto 0', fontSize:11, color:'var(--muted)', textAlign:'center'}}>
            Atlas AI hata yapabilir. Hukuki konularda her zaman sertifikalı avukat onayı alın.
          </div>
        </div>
      </main>
    </div>
  );
}
