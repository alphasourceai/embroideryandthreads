# Embroidery & Threads Site Editor

The client editor is available at:

`https://embroideryandthreads.com/admin/`

## Signing in

1. Visit `https://embroideryandthreads.com/admin/`.
2. Select **Login with Netlify Identity**.
3. Enter the invited email address and password.

The account is invite-only. Do not create a second user if a password is
forgotten; use **Recover password** from the login window instead.

Invitation and password-recovery links are redirected immediately to the site
editor, where the Identity widget handles the token before Decap starts. The
Identity library is not downloaded during normal public visits.

## Updating the site

1. Sign in at `/admin/` and open **Page Photos & Galleries**.
2. Drag a replacement image onto an image field or choose one from the media library.
3. Under **Photo Galleries**, open a gallery to rename it, add photos, remove photos, or drag photos into a new order. The first photo is the cover shown on the home page.
4. Update every image description so it accurately describes the visible product, wording, and colors.
5. Select **Publish**. The editor commits the change to GitHub and Netlify automatically rebuilds the site.
6. Use **View Live** to confirm the published change on the website.

## Image requirements

- Use only original photos the business owns or has permission to publish.
- Use JPG, PNG, or WebP files no larger than 12 MB.
- Prefer portrait or square photos at least 1200 pixels wide.
- Keep the main product centered so automatic mobile crops remain useful.
- Do not include customer names, addresses, or other private information in a photo.
- Write a specific image description; do not begin with "image of."

The deployment checks reject missing files, unsupported formats, undersized
images, oversized files, and empty image descriptions before a bad update can
reach the live site.

The editor uses a full-width form rather than an embedded visual preview. This
keeps the editing runtime isolated from the public React app and avoids a
version conflict between Decap CMS and preview-only React components.

## Hidden content

The client currently sees only **Hero Image**, **Story Image**, and the six **Photo Galleries**.
Each gallery opens as a photo album on the public site. Keep all six gallery entries, and keep at least one photo in each gallery so every category has a cover.
Customer stories, Instagram highlights, and pricing remain in `site.json`, but
their hidden widgets prevent them from appearing in the editor.

## Enabling pricing controls

When a public pricing section is ready, replace the hidden `pricing` field in
`artifacts/embroidery-site/public/admin/config.yml` with this object field:

```yml
- label: Pricing
  name: pricing
  widget: object
  hint: "Pricing remains hidden on the public site until Show Pricing is enabled."
  fields:
    - { label: Show Pricing on Website, name: enabled, widget: boolean, default: false }
    - { label: Small Heading, name: eyebrow, widget: string }
    - { label: Section Title, name: title, widget: string }
    - { label: Introduction, name: intro, widget: text }
    - label: Price Items
      name: items
      widget: list
      min: 1
      summary: "{{fields.name}} - {{fields.price}}"
      fields:
        - { label: Service, name: name, widget: string }
        - { label: Price, name: price, widget: string, hint: "Examples: $35, Starting at $45, or Contact for pricing" }
        - { label: Description, name: description, widget: text }
```

Keep **Show Pricing on Website** disabled until all pricing is approved.
Enabling it publishes the pricing section during the next Netlify build.

## Operational notes

- Check the live site on a phone after replacing several images at once.
- Add photos in the order they should appear in each album; the first photo is also the category cover.
- Netlify keeps deploy history, and GitHub keeps content revision history, so prior versions can be restored.
- If a deployment fails, leave the editor content unchanged and notify the site administrator with a screenshot of the failed deploy.
