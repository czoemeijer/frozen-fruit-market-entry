# Cloudflare Serverless Deploy

## Files

- `worker.js` API endpoint implementation (`/submit`)
- `schema.sql` D1 schema
- `wrangler.toml.example` starter config

## Quick Steps

```bash
cp wrangler.toml.example wrangler.toml
wrangler d1 create berrie-survey-db
wrangler d1 execute berrie-survey-db --file=./schema.sql
wrangler deploy
```

For an existing database, apply the three-flavor migration once before deploying:

```bash
wrangler d1 execute berrie-survey-db --file=./migrations/0002_add_favorite_flavor.sql
```

Then set frontend submit endpoint to your worker URL if needed:

```html
<script>
  window.SURVEY_SUBMIT_ENDPOINT = "https://<your-worker-domain>/submit";
</script>
```
