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

Then set frontend submit endpoint to your worker URL if needed:

```html
<script>
  window.SURVEY_SUBMIT_ENDPOINT = "https://<your-worker-domain>/submit";
</script>
```
