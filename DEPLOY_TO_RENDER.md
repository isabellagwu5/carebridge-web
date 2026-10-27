# Publish CareBridge with GitHub + Render

This project is a public demo and must not store or process real patient records.

1. Create a new GitHub repository (for example `carebridge-web`).
2. Upload the **contents of this folder**, preserving the `frontend` and `node-backend` directories, plus `render.yaml`.
3. Confirm that `.env` files, credentials and personal records are NOT included.
4. Sign in to Render at https://dashboard.render.com/ and connect your GitHub account.
5. Choose **New > Blueprint** and choose the repository containing `render.yaml`.
6. Review service configuration and deploy. You may omit the optional `GOOGLE_PLACES_API_KEY` for CMS-only testing.
7. If adding Google Places, configure `GOOGLE_PLACES_API_KEY` in the Render service Environment tab. Never put the key in frontend JavaScript.
8. Once deployed, open the `https://...onrender.com` URL from the service dashboard.
9. Verify `/api/health`, then test doctor search and facility searches.

Manual setup alternative: New > Web Service. Root directory `node-backend`; build `npm install`; start `npm start`; health check `/api/health`.

Notes:
- CMS data availability depends on its external API and supported search parameters.
- Zocdoc features remain placeholders until approved partnership access.
- NPI/CMS directory presence is not proof of licensure or open appointment slots.
- Do not display invented appointment availability, network participation, or verified reviews.
- A free Render service can sleep when idle and take time to wake.
- Keep Care Passport limited to fictional data until appropriate compliance/security controls have been implemented.
