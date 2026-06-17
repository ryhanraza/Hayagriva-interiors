import { insforge } from '../../../../lib/insforge'
import { verifyAdmin } from '../../../../lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), { 
      status: auth.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const data = await request.json()
    const { title, category, location, budget, year, area, materials, desc, image, image_key } = data

    if (!title || !category || !location || !budget || !year || !area || !materials || !desc || !image) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { data: inserted, error } = await insforge.database
      .from('projects')
      .insert([
        {
          title,
          category,
          location,
          budget,
          year,
          area,
          materials,
          desc_text: desc,
          image,
          image_key: image_key || null
        }
      ])
      .select()

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(inserted[0]), { 
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

export async function PUT(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), { 
      status: auth.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const data = await request.json()
    const { id, title, category, location, budget, year, area, materials, desc, image, image_key } = data

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing project ID' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (category !== undefined) updateData.category = category
    if (location !== undefined) updateData.location = location
    if (budget !== undefined) updateData.budget = budget
    if (year !== undefined) updateData.year = year
    if (area !== undefined) updateData.area = area
    if (materials !== undefined) updateData.materials = materials
    if (desc !== undefined) updateData.desc_text = desc
    if (image !== undefined) updateData.image = image
    if (image_key !== undefined) updateData.image_key = image_key

    const { data: updated, error } = await insforge.database
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(updated[0]), { 
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

export async function DELETE(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), { 
      status: auth.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing project ID' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Retrieve project to get the image key
    const { data: project, error: getError } = await insforge.database
      .from('projects')
      .select('image_key')
      .eq('id', id)
      .maybeSingle()

    if (getError) {
      return new Response(JSON.stringify({ error: getError.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Remove image from storage bucket if it exists
    if (project?.image_key) {
      console.log(`Deleting file from storage: ${project.image_key}`)
      const { error: storageError } = await insforge.storage
        .from('images')
        .remove(project.image_key)
      if (storageError) {
        console.error('Storage deletion failed, continuing database delete:', storageError)
      }
    }

    // Delete record from database
    const { error } = await insforge.database
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true }), { 
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
