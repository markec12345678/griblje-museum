import { db } from './src/lib/db'
import { writeFileSync } from 'fs'
async function main() {
  const srcs = await db.source.findMany({ select: { id: true, url: true, exhibit: { select: { slug: true } } } })
  const ro = srcs.filter(s => s.url && s.url.includes('radio-odeon.com'))
  const urls = [...new Set(ro.map(s => s.url!))]
  writeFileSync('/home/z/tmp-maps/ro-urls.txt', urls.join('\n'))
  console.log('unique RO URLs:', urls.length, '(from', ro.length, 'sources)')
  process.exit(0)
}
main()
