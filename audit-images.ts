import { db } from './src/lib/db'
async function main() {
  const ex = await db.exhibit.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, slug: true, titleSi: true, image: true, imageCredit: true } })
  for (const e of ex) {
    console.log(`${e.id} | ${e.slug} | ${e.titleSi?.slice(0,50)} | IMG: ${e.image ?? 'NONE'} | CREDIT: ${(e.imageCredit ?? '').slice(0,60)}`)
  }
  process.exit(0)
}
main()
