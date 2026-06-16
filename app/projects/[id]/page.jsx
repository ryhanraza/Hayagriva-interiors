import { notFound } from 'next/navigation'
import { getProjectById, projects } from '../../../lib/projects'
import ProjectDetailClient from '../../../components/ProjectDetailClient'

export async function generateStaticParams() {
  return projects.map((project) => ({ id: String(project.id) }))
}

export default function ProjectDetailPage({ params }) {
  const project = getProjectById(params.id)

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}
