/**
 * Seed skripta — napolni muzejsko bazo z dvojezično zbirko.
 * Zagon: bun run prisma/seed.ts (po `bun run db:push`)
 */
import { db } from "../src/lib/db";
import { seedExhibits, seedStories, seedEvents } from "../src/lib/museum-content";
import { seedGuestbook, seedMemories } from "../src/lib/community-content";

async function main() {
  console.log("🌱 Sejanje muzejske zbirke …");

  // Počisti obstoječe zapise (idempotentni seed)
  await db.objectMemory.deleteMany();
  await db.guestbookEntry.deleteMany();
  await db.source.deleteMany();
  await db.exhibit.deleteMany();
  await db.storyItem.deleteMany();
  await db.museumEvent.deleteMany();

  for (const [index, ex] of seedExhibits.entries()) {
    await db.exhibit.create({
      data: {
        slug: ex.slug,
        museumNo: ex.museumNo ?? null,
        category: ex.category,
        titleSi: ex.titleSi,
        titleEn: ex.titleEn,
        periodSi: ex.periodSi,
        periodEn: ex.periodEn,
        summarySi: ex.summarySi,
        summaryEn: ex.summaryEn,
        storySi: ex.storySi,
        storyEn: ex.storyEn,
        evidenceStatus: ex.evidenceStatus,
        image: ex.image ?? null,
        imageCredit: ex.imageCredit ?? null,
        model3dUrl: ex.model3dUrl ?? null,
        model3dCredit: ex.model3dCredit ?? null,
        yearFrom: ex.yearFrom ?? null,
        yearTo: ex.yearTo ?? null,
        lat: ex.lat ?? null,
        lng: ex.lng ?? null,
        coordsApprox: ex.coordsApprox ?? false,
        featured: ex.featured ?? false,
        sortOrder: index,
        addedAt: ex.addedAt ? new Date(ex.addedAt) : null,
        sources: {
          create: ex.sources.map((s, sIndex) => ({
            nameSi: s.nameSi,
            nameEn: s.nameEn,
            sourceType: s.sourceType,
            license: s.license,
            url: s.url ?? null,
            noteSi: s.noteSi ?? null,
            noteEn: s.noteEn ?? null,
            sortOrder: sIndex,
          })),
        },
      },
    });
    console.log(`  ✓ zapis: ${ex.slug}`);
  }

  for (const story of seedStories) {
    await db.storyItem.create({ data: story });
  }
  console.log(`  ✓ zgodbe: ${seedStories.length}`);

  for (const ev of seedEvents) {
    await db.museumEvent.create({ data: { ...ev, startsAt: new Date(ev.startsAt) } });
  }
  console.log(`  ✓ dogodki: ${seedEvents.length}`);

  // Slovar slug → id, za vezavo spominov na predmete.
  const exhibits = await db.exhibit.findMany({ select: { id: true, slug: true } });
  const idBySlug = new Map(exhibits.map((e) => [e.slug, e.id]));

  // Sodelovanje skupnosti — ilustrativni vpisi (glej community-content.ts).
  const DAY = 24 * 60 * 60 * 1000;
  for (const entry of seedGuestbook) {
    await db.guestbookEntry.create({
      data: {
        name: entry.name,
        place: entry.place,
        message: entry.message,
        lang: entry.lang,
        status: "published",
        createdAt: new Date(Date.now() - entry.daysAgo * DAY),
      },
    });
  }
  console.log(`  ✓ spominska knjiga: ${seedGuestbook.length}`);

  let seededMemories = 0;
  for (const mem of seedMemories) {
    const exhibitId = idBySlug.get(mem.exhibitSlug);
    if (!exhibitId) {
      console.warn(`  ! neznan slug za spomin: ${mem.exhibitSlug}`);
      continue;
    }
    await db.objectMemory.create({
      data: {
        exhibitId,
        author: mem.author,
        place: mem.place,
        memory: mem.memory,
        lang: mem.lang,
        status: "published",
        createdAt: new Date(Date.now() - mem.daysAgo * DAY),
      },
    });
    seededMemories += 1;
  }
  console.log(`  ✓ spomini ob predmetih: ${seededMemories}/${seedMemories.length}`);

  console.log("🌱 Končano.");
}

main()
  .catch((error) => {
    console.error("Seed napaka:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
