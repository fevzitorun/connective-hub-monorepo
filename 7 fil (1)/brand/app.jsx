/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard */

const App = () => (
  <DesignCanvas>

    <DCSection id="intro" title="7fil — Marka Kimliği"
      subtitle="Connective Hub Dijital Teknolojiler Ltd. Şti. · Mayıs 2026 · v 1.0">

      <DCArtboard id="cover" label="01 · Kapak" width={1180} height={760}>
        <window.CoverArtboard/>
      </DCArtboard>

      <DCArtboard id="story" label="02 · Marka Hikayesi" width={1180} height={760}>
        <window.StoryArtboard/>
      </DCArtboard>

      <DCArtboard id="voice" label="03 · Ses & Üslup" width={1180} height={760}>
        <window.VoiceArtboard/>
      </DCArtboard>

    </DCSection>

    <DCSection id="logo" title="Logo Sistemi"
      subtitle="Lockup'lar, varyasyonlar, koruma alanı, kullanım kuralları">

      <DCArtboard id="logo-system" label="Logo · tam sistem" width={1180} height={900}>
        <window.LogoSystemArtboard/>
      </DCArtboard>

    </DCSection>

    <DCSection id="palette" title="Renk & Tipografi"
      subtitle="Brief'teki ink / gold / teal / cream sistemi · Playfair Display + DM Sans">

      <DCArtboard id="colors" label="Renk paleti" width={1180} height={900}>
        <window.ColorsArtboard/>
      </DCArtboard>

      <DCArtboard id="type" label="Tipografi" width={1180} height={900}>
        <window.TypeArtboard/>
      </DCArtboard>

    </DCSection>

    <DCSection id="stationery" title="Kurumsal Kimlik · Baskı"
      subtitle="Kartvizit · Antetli kağıt · Zarf · Dosya">

      {/* Kartvizit — 85×55mm at 8 px/mm = 680×440 */}
      <DCArtboard id="kartvizit-on" label="Kartvizit · ön" width={680} height={440}>
        <window.KartvizitFront/>
      </DCArtboard>

      <DCArtboard id="kartvizit-arka" label="Kartvizit · arka" width={680} height={440}>
        <window.KartvizitBack/>
      </DCArtboard>

      {/* DL Envelope — 220×110mm at 3 px/mm = 660×330 */}
      <DCArtboard id="zarf" label="DL Zarf · 220 × 110 mm" width={660} height={330}>
        <window.Envelope/>
      </DCArtboard>

      {/* Antetli — A4 at ~2 px/mm = 420×594 */}
      <DCArtboard id="antetli" label="Antetli kağıt · A4" width={500} height={707}>
        <window.Antetli/>
      </DCArtboard>

      {/* Folder A4 cover */}
      <DCArtboard id="dosya" label="Dosya / klasör kapağı · A4" width={500} height={707}>
        <window.Folder/>
      </DCArtboard>

    </DCSection>

    <DCSection id="apparel" title="Kurumsal Kimlik · Giyim & Promosyon"
      subtitle="Tişört (2 renk seçeneği, ön + arka) · Tote çanta">

      <DCArtboard id="tshirt-ink-front" label="Tişört · Lacivert · ön" width={420} height={500}>
        <window.Tshirt side="front" tone="ink"/>
      </DCArtboard>

      <DCArtboard id="tshirt-ink-back" label="Tişört · Lacivert · arka" width={420} height={500}>
        <window.Tshirt side="back" tone="ink"/>
      </DCArtboard>

      <DCArtboard id="tshirt-cream-front" label="Tişört · Krem · ön" width={420} height={500}>
        <window.Tshirt side="front" tone="cream"/>
      </DCArtboard>

      <DCArtboard id="tshirt-cream-back" label="Tişört · Krem · arka" width={420} height={500}>
        <window.Tshirt side="back" tone="cream"/>
      </DCArtboard>

      <DCArtboard id="tote" label="Tote çanta · naturel bez" width={420} height={500}>
        <window.Tote/>
      </DCArtboard>

    </DCSection>

  </DesignCanvas>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
