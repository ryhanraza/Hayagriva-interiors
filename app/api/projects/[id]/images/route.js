import { insforge } from '../../../../../lib/insforge'

export const dynamic = 'force-dynamic'

// GET /api/projects/[id]/images — public: list gallery images for a project
export async function GET(request, { params }) {
  const { id } = await params

  try {
    const { data, error } = await insforge.database
      .from('project_images')
      .select('id, image_url, image_key, caption, sort_order')
      .eq('project_id', id)
      .order('sort_order', { ascending: true })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
