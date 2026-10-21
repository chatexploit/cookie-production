# Cookie Production — GitHub Pages edition

This is the responsive static demo, containing the featured Jays results section, soft-glow Growth pricing, reviews section and all the brand assets. It does **not** include PHP, config files, database passwords or an admin login.

## Publish

1. Create a repository on GitHub (e.g. `cookie-production`).
2. Upload the **contents** of this ZIP into the repository root. `index.html` should be at the top level.
3. In GitHub repository **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/(root)`.
4. Open `https://YOUR-USERNAME.github.io/cookie-production/` after Pages completes its build.

## Add more results/reviews on GitHub Pages

The static demo supports `data/results.json` and `data/reviews.json`. Edit the JSON in your repo, commit, then wait for Pages to redeploy. **Do not invent results or testimonials; get publication permission from your clients.**

Result example:
```json
[
  {
    "client": "Your client",
    "title": "Campaign title",
    "description": "Time range, goal and context",
    "conversations": 25,
    "cost_per_result": 18.75,
    "amount_spent": 468.75,
    "reach": 1200,
    "impressions": 2800,
    "image": null
  }
]
```

Review example:
```json
[
  {"author":"Real client name","company":"Company / role","quote":"Approved review text.","rating":5}
]
```

Optional result images must be placed in the `uploads/` folder and referred to in JSON by filename, but the built-in image filename validation expects a 40-character lowercase hexadecimal name followed by `.jpg`, `.png`, or `.webp`. This prevents arbitrary image URLs. Leave `image` as `null` if you do not have a compliant file.

These JSON files have `[]` initially, so the site shows an honest empty state until real results and reviews are added. The featured Jays screenshot is already built into the HTML.

## Important

Hostingial runs the live PHP + MySQL admin backend. GitHub Pages cannot access that dashboard or database. Admin edits on Hostingial do **not** automatically sync to GitHub Pages; you must manually update the static JSON/images or implement an export pipeline.
