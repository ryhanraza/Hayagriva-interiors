import { insforge } from '../../../lib/insforge'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Attempt to select projects from the database
    const { data: dbProjects, error } = await insforge.database
      .from('projects')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching projects from DB, falling back to static:', error)
      const { projects: staticProjects } = await import('../../../lib/projects-static')
      return new Response(JSON.stringify(staticProjects), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // If database is empty, auto-seed it with the static projects
    if (!dbProjects || dbProjects.length === 0) {
      console.log('Projects table is empty. Auto-seeding projects from projects-static.js...')
      const { projects: staticProjects } = await import('../../../lib/projects-static')
      
      const { data: seeded, error: seedError } = await insforge.database
        .from('projects')
        .insert(
          staticProjects.map((p) => ({
            title: p.title,
            category: p.category,
            location: p.location,
            budget: p.budget,
            year: p.year,
            area: p.area,
            materials: p.materials,
            desc_text: p.desc,
            image: p.image,
          }))
        )
        .select()

      if (seedError) {
        console.error('Seeding projects failed:', seedError)
        return new Response(JSON.stringify(staticProjects), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const mappedSeeded = (seeded || []).map((p) => ({
        ...p,
        desc: p.desc_text,
      }))

      return new Response(JSON.stringify(mappedSeeded), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Map desc_text to desc for compatibility
    const mappedProjects = dbProjects.map((p) => ({
      ...p,
      desc: p.desc_text,
    }))

    return new Response(JSON.stringify(mappedProjects), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Projects API error:', err)
    try {
      const { projects: staticProjects } = await import('../../../lib/projects-static')
      return new Response(JSON.stringify(staticProjects), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to fetch projects', details: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}
