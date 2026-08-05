# Vercel Serverless Deploy

## Files

- `api/submit.js` Vercel function
- `package.json` function dependency (`@vercel/postgres`)
- `vercel.json` function runtime config

## Quick Steps

```bash
npm install
vercel
```

In Vercel dashboard:

1. Add Vercel Postgres integration
2. Redeploy
3. Use `/api/submit` as API path

Frontend endpoint override (optional):

```html
<script>
  window.SURVEY_SUBMIT_ENDPOINT = "/api/submit";
</script>
```
