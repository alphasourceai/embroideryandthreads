# Embroidery & Threads Site Editor

The client editor is available at:

`https://embroideryandthreads.com/admin/`

## One-time Netlify setup

1. Open the Embroidery & Threads project in Netlify.
2. Enable Netlify Identity.
3. Set registration to **Invite only**.
4. Enable **Git Gateway** under Identity services.
5. Invite `embroideryandthreads@gmail.com` as an Identity user.
6. Have the client accept the invitation and set a password.

Invitation and password-recovery links are redirected immediately to the site
editor, where the Identity widget handles the token before Decap starts. The
Identity library is not downloaded during normal public visits.

## Updating the site

1. Sign in at `/admin/` and open **Page Photos**.
2. Drag a replacement image onto an image field or choose one from the media library.
3. Update the image description so it accurately describes the replacement image.
4. Select **Publish**. The editor commits the change to GitHub and Netlify automatically rebuilds the site.
5. Use **View Live** to confirm the published change on the website.

The editor uses a full-width form rather than an embedded visual preview. This
keeps the editing runtime isolated from the public React app and avoids a
version conflict between Decap CMS and preview-only React components.

## Hidden content

The client currently sees only **Hero Image**, **Story Image**, and **Gallery**.
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

- Use original photos that the client owns or has permission to publish.
- Prefer clear portrait or square images at least 1200 pixels wide.
- Check the live site on a phone after replacing several images at once.
- Netlify keeps deploy history, and GitHub keeps content revision history, so prior versions can be restored.
