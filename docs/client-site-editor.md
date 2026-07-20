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

## Updating the site

1. Sign in at `/admin/` and open **Page Images, Reviews, and Pricing**.
2. Drag a replacement image onto an image field or choose one from the media library.
3. Update the image description so it accurately describes the replacement image.
4. Review the page preview beside the editor.
5. Select **Publish**. The editor commits the change to GitHub and Netlify automatically rebuilds the site.

## Pricing guardrail

Pricing content can be prepared without displaying it publicly. Keep **Show Pricing on Website** disabled until all pricing is approved. Enabling that switch publishes the pricing section on the home page during the next Netlify build.

## Operational notes

- Use original photos that the client owns or has permission to publish.
- Prefer clear portrait or square images at least 1200 pixels wide.
- Check the live site on a phone after replacing several images at once.
- Netlify keeps deploy history, and GitHub keeps content revision history, so prior versions can be restored.
