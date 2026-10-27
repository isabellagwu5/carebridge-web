# CareBridge — VS Code project

## Frontend organization

- `frontend/index.html` — **main HTML structure** (screens, navigation, forms and results containers)
- `frontend/styles.css` — styles and responsive layouts based on the CareBridge teal/mint design
- `frontend/script.js` — **core functionality**: page navigation, multilingual UI, directory search, CMS/Places result cards, Zocdoc connection status, consent-controlled Care Passport preview, printing/copying and deletion
- `frontend/api.js` — browser-to-backend API client; no secret credentials

## Backends

`node-backend/src/server.js` exposes `/api/cms/:resource`, `/api/places`, and `/api/zocdoc/status` and serves the frontend. Each integration lives in its own module under `node-backend/src/integrations/`.

`java-backend/` is a **separate alternative Spring Boot starter**. The front end is set up to use the Node backend first; do not run both as the same API service without configuring routing.

## Local setup in VS Code

1. Install Node.js 20+.
2. Open this folder in VS Code.
3. In terminal:
   ```bash
   cd node-backend
   npm install
   ```
4. Copy `.env.example` to `.env`. Set `GOOGLE_PLACES_API_KEY=...` to enable Places.
5. Run `npm run dev` and open **http://localhost:3000**.

**Do not open `frontend/index.html` using Live Server on a separate port** unless you configure an API proxy; use the Node server above so `/api/...` routes resolve.

## Boundaries

- CMS National Provider Directory: public FHIR directory search, not automatic licensure, insurance or calendar verification. Supported search parameters can differ by endpoint; test against live CMS docs.
- Google Places API (New): API key and billing required. Results can show a facility website but that is not necessarily a scheduling page. Follow Google's display, attribution, and storage requirements.
- Zocdoc: not connected. Its adapter explicitly reports partner approval required. Do not show fictional appointment inventory.
- Search queries go to the Node backend and the selected provider. Avoid entering personal health information in searches.
- Passport: demo-only fictional notes held in JavaScript memory. The app does **not** persist medical records and is not a clinical record system. Clearing it does not revoke browser clipboard copies or files printed by the user.
- Additional languages have partial UI translations; English is the fallback. Clinical translation must be independently reviewed.
- Production deployment needs authentication, data protection, consent and deletion controls, secure logging, provider matching, verification, accessibility testing, privacy/legal review and live API testing.
