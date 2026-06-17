import { notFound } from 'next/navigation'
import { insforge } from '../../../lib/insforge'
import ProjectDetailClient from '../../../components/ProjectDetailClient'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params }) {
  const { id } = params

  let project = null

  try {
    const { data, error } = await insforge.database
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (!error && data) {
      project = {
        ...data,
        desc: data.desc_text
      }
    }
  } catch (err) {
    console.error('Failed to fetch project from database:', err)
  }

  // Fallback to static projects if database query returned nothing or failed
  if (!project) {
    try {
      const { getProjectById } = await import('../../../lib/projects-static')
      project = getProjectById(id)
    } catch (importErr) {
      console.error('Failed to import static projects:', importErr)
    }
  }

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}
