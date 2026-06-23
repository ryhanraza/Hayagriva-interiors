import { notFound } from 'next/navigation'
import { insforge } from '../../../lib/insforge'
import ProjectDetailClient from '../../../components/ProjectDetailClient'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const searchId = Number(id)
  const projectId = Number.isNaN(searchId) ? id : searchId

  let project = null

  try {
    const { data, error } = await insforge.database
      .from('projects')
      .select('*')
      .eq('id', projectId)
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

  // Fetch extra gallery images for this project (best-effort)
  let gallery = []
  if (project?.id) {
    try {
      const { data: imgs, error: imgErr } = await insforge.database
        .from('project_images')
        .select('id, image_url, caption, sort_order')
        .eq('project_id', project.id)
        .order('sort_order', { ascending: true })
      if (!imgErr && Array.isArray(imgs)) {
        gallery = imgs
      }
    } catch (err) {
      console.error('Failed to fetch gallery images:', err)
    }
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

  return <ProjectDetailClient project={project} gallery={gallery} />
}
