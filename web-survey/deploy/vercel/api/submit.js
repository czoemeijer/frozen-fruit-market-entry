import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    const data = req.body || {};

    await sql`
      CREATE TABLE IF NOT EXISTS survey_responses (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        language TEXT,
        age TEXT,
        children TEXT,
        purchase_frequency TEXT,
        preference TEXT,
        intent INTEGER,
        psm_too_cheap INTEGER,
        psm_cheap INTEGER,
        psm_expensive INTEGER,
        psm_too_expensive INTEGER,
        local_importance INTEGER,
        premium_wtp TEXT,
        main_barrier TEXT,
        franui_visual INTEGER,
        franui_quality INTEGER,
        franui_health INTEGER,
        berrie_visual INTEGER,
        berrie_quality INTEGER,
        berrie_health INTEGER,
        client_ip TEXT
      )
    `;

    await sql`
      INSERT INTO survey_responses (
        language, age, children, purchase_frequency, preference, intent,
        psm_too_cheap, psm_cheap, psm_expensive, psm_too_expensive,
        local_importance, premium_wtp, main_barrier,
        franui_visual, franui_quality, franui_health,
        berrie_visual, berrie_quality, berrie_health, client_ip
      ) VALUES (
        ${data.lang || 'cs'},
        ${data.age || ''},
        ${data.children || ''},
        ${data.purchase_frequency || ''},
        ${data.preference || ''},
        ${Number(data.intent || 0)},
        ${Number(data.psm_too_cheap || 0)},
        ${Number(data.psm_cheap || 0)},
        ${Number(data.psm_expensive || 0)},
        ${Number(data.psm_too_expensive || 0)},
        ${Number(data.local_importance || 0)},
        ${data.premium_wtp || ''},
        ${data.main_barrier || ''},
        ${Number(data.franui_visual || 0)},
        ${Number(data.franui_quality || 0)},
        ${Number(data.franui_health || 0)},
        ${Number(data.berrie_visual || 0)},
        ${Number(data.berrie_quality || 0)},
        ${Number(data.berrie_health || 0)},
        ${req.headers['x-forwarded-for'] || ''}
      )
    `;

    return res.status(200).json({ status: 'success', message: 'Saved' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
