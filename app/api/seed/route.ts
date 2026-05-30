import { NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import { hashPassword } from "@/app/lib/auth";

export async function POST(_request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ ok: false, error: "Üretim ortamında seed çalıştırılamaz." }, { status: 403 });
  }

  const created: string[] = [];

  try {
    // Admin user
    const adminHash = await hashPassword("Admin123!");
    const admin = await db.user.upsert({
      where: { email: "admin@7fil.com.tr" },
      update: {},
      create: {
        email: "admin@7fil.com.tr",
        passwordHash: adminHash,
        name: "7fil Admin",
        role: "admin",
        isActive: true,
        isVerified: true,
      },
    });
    created.push(`Admin: ${admin.email}`);

    // Agency 1
    const owner1Hash = await hashPassword("Agency123!");
    const owner1 = await db.user.upsert({
      where: { email: "ahmet@maslakgyr.com" },
      update: {},
      create: {
        email: "ahmet@maslakgyr.com",
        passwordHash: owner1Hash,
        name: "Ahmet Karahan",
        role: "agency_owner",
        phone: "+905301234567",
        isActive: true,
      },
    });
    created.push(`Agency owner 1: ${owner1.email}`);

    const agency1 = await db.agency.upsert({
      where: { slug: "maslak-gayrimenkul" },
      update: {},
      create: {
        name: "Maslak Gayrimenkul A.Ş.",
        slug: "maslak-gayrimenkul",
        ownerId: owner1.id,
        email: owner1.email,
        phone: "+902123456789",
        city: "İstanbul",
        district: "Sarıyer",
        country: "TR",
        isApproved: true,
        isActive: true,
        approvedAt: new Date(),
        subscriptionTier: "pro",
      },
    });
    created.push(`Agency 1: ${agency1.name}`);

    await db.subscription.upsert({
      where: { agencyId: agency1.id },
      update: {},
      create: {
        agencyId: agency1.id,
        tier: "pro",
        priceMonthly: 149,
        currency: "TRY",
        giftCredit: 1000,
        status: "active",
      },
    });

    // Agency 2
    const owner2Hash = await hashPassword("Agency123!");
    const owner2 = await db.user.upsert({
      where: { email: "zeynep@bogazemlaak.com" },
      update: {},
      create: {
        email: "zeynep@bogazemlaak.com",
        passwordHash: owner2Hash,
        name: "Zeynep Şahin",
        role: "agency_owner",
        phone: "+905309876543",
        isActive: true,
      },
    });
    created.push(`Agency owner 2: ${owner2.email}`);

    const agency2 = await db.agency.upsert({
      where: { slug: "bogaz-emlak" },
      update: {},
      create: {
        name: "Boğaz Emlak Ltd.",
        slug: "bogaz-emlak",
        ownerId: owner2.id,
        email: owner2.email,
        phone: "+902129876543",
        city: "İstanbul",
        district: "Beşiktaş",
        country: "TR",
        isApproved: false,
        isActive: true,
        subscriptionTier: "free",
      },
    });
    created.push(`Agency 2: ${agency2.name}`);

    await db.subscription.upsert({
      where: { agencyId: agency2.id },
      update: {},
      create: {
        agencyId: agency2.id,
        tier: "free",
        priceMonthly: 0,
        currency: "TRY",
        giftCredit: 1000,
        status: "active",
      },
    });

    // Partners
    const partnerTypes = [
      { email: "avukat@hukuk.av.tr", name: "Mehmet Aydın", type: "lawyer", company: "Aydın Hukuk Bürosu" },
      { email: "kredi@isbank.com", name: "Ali Yıldız", type: "bank", company: "İş Bankası Mortgage" },
      { email: "faizsiz@kuveytturk.com", name: "Fatma Kaya", type: "participation_bank", company: "Kuveyt Türk Katılım" },
      { email: "sigorta@allianz.com", name: "Can Özkan", type: "insurance", company: "Allianz Sigorta" },
    ];

    for (const pt of partnerTypes) {
      const pHash = await hashPassword("Partner123!");
      const pUser = await db.user.upsert({
        where: { email: pt.email },
        update: {},
        create: {
          email: pt.email,
          passwordHash: pHash,
          name: pt.name,
          role: "partner",
          isActive: true,
        },
      });

      const existing = await db.partner.findUnique({ where: { userId: pUser.id } });
      if (!existing) {
        await db.partner.create({
          data: {
            userId: pUser.id,
            type: pt.type,
            companyName: pt.company,
            isVerified: true,
            isActive: true,
          },
        });
      }

      created.push(`Partner (${pt.type}): ${pt.name}`);
    }

    // Sample listings for agency 1
    const listingData = [
      { title: "Beşiktaş 3+1 Deniz Manzaralı Daire", city: "İstanbul", district: "Beşiktaş", propertyType: "apartment", listingType: "sale", rooms: "3+1", areaGross: 145, priceAmount: 4850000 },
      { title: "Levent Merkezi Ofis 380m²", city: "İstanbul", district: "Levent", propertyType: "office", listingType: "rent", areaGross: 380, priceAmount: 65000 },
      { title: "Maslak 2+1 Modern Kiralık", city: "İstanbul", district: "Maslak", propertyType: "apartment", listingType: "rent", rooms: "2+1", areaGross: 95, priceAmount: 32000 },
    ];

    for (let i = 0; i < listingData.length; i++) {
      const ld = listingData[i];
      const slug = `${ld.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${agency1.id.slice(0, 6)}-${i}`;

      const existingListing = await db.listing.findUnique({ where: { slug } });
      if (!existingListing) {
        await db.listing.create({
          data: {
            agencyId: agency1.id,
            slug,
            status: "active",
            priceCurrency: "TRY",
            country: "TR",
            viewCount: Math.floor(Math.random() * 5000),
            ...ld,
          },
        });
      }

      created.push(`Listing: ${ld.title}`);
    }

    // Sample leads
    const leadData = [
      { name: "Kemal Arslan", email: "kemal@email.com", phone: "+905551234567", source: "platform", status: "new", score: 72 },
      { name: "Selin Çelik", email: "selin@email.com", phone: "+905559876543", source: "referral", status: "qualified", score: 88 },
      { name: "Baran Koç", phone: "+905554567890", source: "sahibinden", status: "new", score: 35 },
    ];

    for (const ld of leadData) {
      const existing = await db.lead.findFirst({ where: { agencyId: agency1.id, name: ld.name } });
      if (!existing) {
        await db.lead.create({
          data: { agencyId: agency1.id, ...ld },
        });
      }
      created.push(`Lead: ${ld.name}`);
    }

    return Response.json({ ok: true, created });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
