import HomeView from './home-view'
import { getSeoForPage, buildMetadata } from '../lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return buildMetadata(await getSeoForPage('home'))
}

export default async function Page() {
  return <HomeView />
}
