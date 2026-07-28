import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { imageSize } from "image-size";

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const publicDir = path.join(appRoot, "public");
const contentPath = path.join(appRoot, "src", "content", "site.json");
const content = JSON.parse(await readFile(contentPath, "utf8"));
const pricingPath = path.join(appRoot, "src", "content", "pricing.json");
const pricing = JSON.parse(await readFile(pricingPath, "utf8"));
const errors = [];
const maxBytes = 1_250_000;
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const gallery = Array.isArray(content.gallery) ? content.gallery : [];
if (
  !Array.isArray(content.gallery) ||
  content.gallery.length < 1 ||
  content.gallery.length > 12
) {
  errors.push("Gallery: include between one and twelve galleries.");
}

for (const [label, value] of [
  ["Homepage faith statement", content.faithMessage?.quote],
  ["Homepage Bible verse", content.faithMessage?.verse],
  ["Homepage Bible verse reference", content.faithMessage?.reference],
]) {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${label}: text is required.`);
  }
}

const pricingCategories = Array.isArray(pricing.categories)
  ? pricing.categories
  : [];
if (pricingCategories.length !== 7) {
  errors.push("Pricing: include exactly seven categories.");
}

const pricingNames = new Set();
for (const [categoryIndex, category] of pricingCategories.entries()) {
  const categoryName =
    typeof category?.name === "string" ? category.name.trim() : "";
  if (!categoryName) {
    errors.push(`Pricing category ${categoryIndex + 1}: name is required.`);
  }
  if (pricingNames.has(categoryName.toLowerCase())) {
    errors.push(
      `Pricing category ${categoryIndex + 1}: category names must be unique.`,
    );
  }
  pricingNames.add(categoryName.toLowerCase());

  if (!Array.isArray(category?.items) || category.items.length < 1) {
    errors.push(
      `Pricing category ${categoryIndex + 1}: include at least one item.`,
    );
    continue;
  }

  for (const [itemIndex, item] of category.items.entries()) {
    if (typeof item?.name !== "string" || !item.name.trim()) {
      errors.push(
        `Pricing category ${categoryIndex + 1}, item ${itemIndex + 1}: name is required.`,
      );
    }
    if (typeof item?.price !== "string" || !item.price.trim()) {
      errors.push(
        `Pricing category ${categoryIndex + 1}, item ${itemIndex + 1}: price is required.`,
      );
    }
  }
}

const galleryNames = new Set();
for (const [index, item] of gallery.entries()) {
  const name = typeof item?.name === "string" ? item.name.trim() : "";
  if (!name) errors.push(`Gallery ${index + 1}: name is required.`);
  if (galleryNames.has(name.toLowerCase())) {
    errors.push(`Gallery ${index + 1}: gallery names must be unique.`);
  }
  galleryNames.add(name.toLowerCase());
  if (!Array.isArray(item?.images) || item.images.length < 1) {
    errors.push(`Gallery ${index + 1}: include at least one photo.`);
  }
}

const reviews = Array.isArray(content.reviews) ? content.reviews : [];
const reviewSources = new Set(["instagram", "google", "direct"]);
if (!Array.isArray(content.reviews) || reviews.length < 1) {
  errors.push("Reviews: include at least one customer review.");
}
for (const [index, review] of reviews.entries()) {
  const label = `Review ${index + 1}`;
  if (!reviewSources.has(review?.source)) {
    errors.push(`${label}: select Instagram, Google, or direct feedback.`);
  }
  if (typeof review?.reviewer !== "string" || !review.reviewer.trim()) {
    errors.push(`${label}: customer name or handle is required.`);
  }
  if (typeof review?.quote !== "string" || review.quote.trim().length < 8) {
    errors.push(`${label}: review must be at least 8 characters.`);
  }
  if (
    review?.rating !== null &&
    review?.rating !== undefined &&
    (!Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5)
  ) {
    errors.push(`${label}: rating must be a whole number from 1 to 5.`);
  }
  if (review?.image && !review?.alt) {
    errors.push(`${label}: describe the screenshot or photo.`);
  }
}

const images = [
  ["Hero image", content.hero],
  ["Story image", content.story],
  ...gallery.flatMap((galleryItem, galleryIndex) =>
    (Array.isArray(galleryItem?.images) ? galleryItem.images : []).map(
      (item, imageIndex) => [
        `Gallery ${galleryIndex + 1} image ${imageIndex + 1}`,
        item,
      ],
    ),
  ),
  ...reviews.flatMap((review, reviewIndex) =>
    review?.image ? [[`Review ${reviewIndex + 1} image`, review]] : [],
  ),
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
      errors.push(`${label}: image is larger than 1.25 MB.`);
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

console.log(
  `Validated ${gallery.length} galleries, ${reviews.length} reviews, ${pricingCategories.length} pricing categories, and ${images.length} editable images and descriptions.`,
);
