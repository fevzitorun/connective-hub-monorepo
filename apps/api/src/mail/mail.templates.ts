const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://7fil.com.tr'

const layout = (content: string) => `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>7fil</title>
</head>
<body style="margin:0;padding:0;background:#f8f5f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f5f0;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr><td style="background:#1a1a2e;padding:24px 32px;">
          <p style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
            7<span style="color:#f5c842;">fil</span>
          </p>
          <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:1px;text-transform:uppercase;">
            Türkiye'nin Entegre Gayrimenkul Platformu
          </p>
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:32px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 32px;background:#f8f5f0;border-top:1px solid #ede8e0;">
          <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">
            © ${new Date().getFullYear()} 7fil · Connective Hub Dijital Teknolojiler Ltd. Şti.<br/>
            Bu e-postayı almak istemiyorsanız <a href="${BASE_URL}/abonelik-iptal" style="color:#2dd4bf;">aboneliği iptal edin</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

const heading = (text: string) =>
  `<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a2e;">${text}</h1>`

const para = (text: string) =>
  `<p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6;">${text}</p>`

const btn = (text: string, href: string, color = '#2dd4bf') =>
  `<a href="${href}" style="display:inline-block;padding:13px 28px;background:${color};color:${color === '#f5c842' ? '#1a1a2e' : '#ffffff'};font-weight:700;font-size:15px;text-decoration:none;border-radius:10px;margin-bottom:24px;">${text}</a>`

const divider = () => `<hr style="border:none;border-top:1px solid #f0ebe4;margin:24px 0;"/>`

const kv = (label: string, value: string) =>
  `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">${label}</td><td style="padding:6px 0;font-weight:600;color:#1a1a2e;font-size:13px;">${value}</td></tr>`

// ── Templates ──────────────────────────────────────────────────────────────

export function tplWelcome(name: string) {
  return {
    subject: '7fil\'e Hoş Geldiniz! 🏡',
    html: layout(`
      ${heading(`Merhaba, ${name}! 👋`)}
      ${para('7fil hesabınız başarıyla oluşturuldu. Türkiye\'nin entegre gayrimenkul ekosistemine hoş geldiniz.')}
      ${btn('Platforma Git', `${BASE_URL}/panel`)}
      ${divider()}
      <p style="margin:0;font-size:13px;color:#9ca3af;">7fil ile yapabilecekleriniz: ilan yönetimi, mortgage hesaplama, hukuki analiz, açık artırma ve çok daha fazlası.</p>
    `),
  }
}

export function tplPasswordReset(name: string, resetLink: string) {
  return {
    subject: 'Şifre Sıfırlama İsteği — 7fil',
    html: layout(`
      ${heading('Şifrenizi Sıfırlayın')}
      ${para(`Merhaba ${name}, hesabınız için şifre sıfırlama isteği aldık.`)}
      ${para('Aşağıdaki butona tıklayarak şifrenizi güncelleyebilirsiniz. Bu bağlantı <strong>1 saat</strong> geçerlidir.')}
      ${btn('Şifremi Sıfırla', resetLink, '#1a1a2e')}
      ${divider()}
      ${para('Bu isteği siz göndermediyseniz bu e-postayı görmezden gelebilirsiniz. Hesabınız güvende.')}
    `),
  }
}

export function tplMortgageLead(bankUserName: string, lead: {
  contactName: string; contactPhone: string; loanAmount: number
  loanTermYears: number; listingTitle: string; loanType: string
}) {
  return {
    subject: `Yeni Mortgage Lead: ${lead.contactName} — 7fil`,
    html: layout(`
      ${heading('Yeni Mortgage Talebi 🏦')}
      ${para(`Merhaba ${bankUserName}, platformda size yeni bir kredi talebi iletildi.`)}
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${kv('İsim', lead.contactName)}
        ${kv('Telefon', lead.contactPhone)}
        ${kv('Kredi Tutarı', `${lead.loanAmount.toLocaleString('tr-TR')} ₺`)}
        ${kv('Vade', `${lead.loanTermYears} yıl`)}
        ${kv('Kredi Tipi', lead.loanType === 'islamic' ? 'İslami Finans (Murabaha)' : 'Konvansiyonel')}
        ${kv('İlan', lead.listingTitle)}
      </table>
      ${btn('Lead\'i İncele', `${BASE_URL}/panel/banka`)}
    `),
  }
}

export function tplLegalCase(lawyerName: string, caseInfo: {
  listingTitle: string; city: string; requestType: string; description: string
}) {
  return {
    subject: `Yeni Hukuki Talep — 7fil`,
    html: layout(`
      ${heading('Yeni Hukuki Danışmanlık Talebi ⚖️')}
      ${para(`Merhaba ${lawyerName}, size yeni bir hukuki danışmanlık talebi iletildi.`)}
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${kv('İlan', caseInfo.listingTitle)}
        ${kv('Şehir', caseInfo.city)}
        ${kv('Talep Türü', caseInfo.requestType)}
      </table>
      <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Açıklama:</p>
      <blockquote style="margin:0 0 24px;padding:12px 16px;background:#f8f5f0;border-left:3px solid #2dd4bf;border-radius:0 8px 8px 0;font-size:14px;color:#4b5563;">
        ${caseInfo.description.slice(0, 300)}${caseInfo.description.length > 300 ? '…' : ''}
      </blockquote>
      ${btn('Talebi İncele', `${BASE_URL}/panel/hukuk`)}
    `),
  }
}

export function tplAuctionOutbid(userName: string, auction: {
  title: string; id: string; newPrice: number; yourBid: number
}) {
  return {
    subject: `Teklifiniz Geçildi — ${auction.title}`,
    html: layout(`
      ${heading('Teklifiniz Geçildi! 🔔')}
      ${para(`Merhaba ${userName}, <strong>${auction.title}</strong> açık artırmasında teklifiniz geçildi.`)}
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${kv('Sizin teklifiniz', `${auction.yourBid.toLocaleString('tr-TR')} ₺`)}
        ${kv('Yeni en yüksek teklif', `${auction.newPrice.toLocaleString('tr-TR')} ₺`)}
      </table>
      ${para('Hâlâ kazanmak istiyorsanız yeni teklifinizi verin!')}
      ${btn('Artırmaya Katıl', `${BASE_URL}/muzayede/${auction.id}`, '#f5c842')}
    `),
  }
}

export function tplAuctionWon(userName: string, auction: {
  title: string; id: string; finalPrice: number
}) {
  return {
    subject: `Tebrikler! Açık Artırmayı Kazandınız 🏆`,
    html: layout(`
      ${heading('Artırmayı Kazandınız! 🏆')}
      ${para(`Tebrikler ${userName}! <strong>${auction.title}</strong> açık artırmasını kazandınız.`)}
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${kv('Kazanılan Fiyat', `${auction.finalPrice.toLocaleString('tr-TR')} ₺`)}
      </table>
      ${para('Satıcı ile iletişim için müzayede sayfasını ziyaret edin.')}
      ${btn('Artırmayı Görüntüle', `${BASE_URL}/muzayede/${auction.id}`, '#f5c842')}
    `),
  }
}

export function tplListingExpiry(agencyName: string, listings: { title: string; expiresAt: string }[]) {
  const rows = listings.map((l) =>
    `<tr><td style="padding:8px 0;font-size:13px;color:#1a1a2e;">${l.title}</td><td style="padding:8px 0;font-size:13px;color:#ef4444;text-align:right;">${new Date(l.expiresAt).toLocaleDateString('tr-TR')}</td></tr>`
  ).join('')

  return {
    subject: `${listings.length} İlanınız Yakında Sona Eriyor — 7fil`,
    html: layout(`
      ${heading('İlanlarınız Sona Eriyor ⏰')}
      ${para(`Merhaba ${agencyName}, aşağıdaki ilanlarınızın yayın süresi yakında dolacak.`)}
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr style="border-bottom:1px solid #f0ebe4;">
          <th style="text-align:left;padding:8px 0;font-size:12px;color:#6b7280;font-weight:600;">İlan</th>
          <th style="text-align:right;padding:8px 0;font-size:12px;color:#6b7280;font-weight:600;">Son Tarih</th>
        </tr>
        ${rows}
      </table>
      ${btn('İlanlarımı Yönet', `${BASE_URL}/panel/ilanlar`)}
    `),
  }
}

export function tplSubscriptionRenewal(agencyName: string, plan: string, renewsAt: string) {
  return {
    subject: `Abonelik Yenileme Hatırlatması — 7fil`,
    html: layout(`
      ${heading('Abonelik Yenileme 💳')}
      ${para(`Merhaba ${agencyName}, <strong>${plan}</strong> planınız yakında yenilenecek.`)}
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${kv('Plan', plan)}
        ${kv('Yenileme Tarihi', new Date(renewsAt).toLocaleDateString('tr-TR'))}
      </table>
      ${btn('Aboneliğimi Yönet', `${BASE_URL}/panel/abonelik`)}
    `),
  }
}
