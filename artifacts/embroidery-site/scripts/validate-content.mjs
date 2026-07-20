import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { imageSize } from "image-size";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(appRoot, "public");
const contentPath = path.join(appRoot, "src", "content", "site.json");
const content = JSON.parse(await readFile(contentPath, "utf8"));
const errors = [];
const maxBytes = 12 * 1024 * 1024;
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const gallery = Array.isArray(content.gallery) ? content.gallery : [];
if (!Array.isArray(content.gallery) || content.gallery.length < 1) {
  errors.push("Gallery: include at least one image.");
}

const images = [
  ["Hero image", content.hero],
  ["Story image", content.story],
  ...gallery.map((item, index) => [`Gallery image ${index + 1}`, item]),
];

for (const [label, item] of images) {
  if (!item || typeof item.image !== "string" || !item.image.startsWith("/")) {
    errors.push(`${label}: image must be a root-relative public path.`);
    continue;
  }

  if (typeof item.alt !== "string" || item.alt.trim().length < 12) {
    errors.push(`${label}: image description must be at least 12 characters.`);
  }

  const relativePath = item.image.slice(1);
  const imagePath = path.resolve(publicDir, relativePath);
  if (!imagePath.startsWith(`${publicDir}${path.sep}`)) {
    errors.push(`${label}: image path escapes the public directory.`);
    continue;
  }

  if (!allowedExtensions.has(path.extname(imagePath).toLowerCase())) {
    errors.push(`${label}: use a JPG, PNG, or WebP image.`);
    continue;
  }

  try {
    const file = await stat(imagePath);
    if (file.size > maxBytes) {
      errors.push(`${label}: image is larger than 12 MB.`);
    }

    const dimensions = imageSize(await readFile(imagePath));
    if (!dimensions.width || !dimensions.height) {
      errors.push(`${label}: image dimensions could not be read.`);
    } else if (dimensions.width < 480 || dimensions.height < 480) {
      errors.push(`${label}: image must be at least 480px in both dimensions.`);
    }
  } catch (error) {
    errors.push(`${label}: ${error.message}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${images.length} editable images and descriptions.`);
