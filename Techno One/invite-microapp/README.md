# Techno One Invite Microapp

Standalone app for adding a recipient name to the Techno One realtor invitation artwork and exporting it as PNG or JPG.

## Run

```bash
npm install
npm start
```

Open `http://localhost:3100`.

By default the app uses port `3100` to avoid clashing with the main landing site. To use a custom port:

```bash
$env:PORT=3200; npm start
```

## Files

- `public/assets/realtor-invitation.jpeg` is the unchanged base artwork.
- `public/js/app.js` draws the artwork and overlays only the recipient name.
- `public/css/style.css` styles the editor page only, not the exported invite.
