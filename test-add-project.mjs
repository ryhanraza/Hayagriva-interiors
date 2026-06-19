import { createClient } from '@insforge/sdk';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key) env[key] = value.trim();
});

const client = createClient({
    baseUrl: env.NEXT_PUBLIC_INSFORGE_URL,
    anonKey: env.INSFORGE_SERVICE_ROLE_KEY // use service role key
});

async function run() {
    try {
        console.log('Inserting project...');
        const { data, error } = await client.database
            .from('projects')
            .insert([
                {
                    title: 'Test Project',
                    category: 'Kitchen',
                    location: 'Vizag',
                    budget: '₹10L',
                    year: '2024',
                    area: '300 sqft',
                    materials: 'Wood',
                    desc_text: 'Beautiful test project',
                    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115'
                }
            ])
            .select();
        
        console.log('data:', data);
        console.log('error:', error);

        console.log('Selecting all projects...');
        const { data: allProjects, error: selectError } = await client.database
            .from('projects')
            .select('*');
        console.log('All projects:', allProjects);
        console.log('Select error:', selectError);
    } catch (err) {
        console.error('Exception:', err);
    }
}

run();
