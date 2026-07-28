(function registerEditorGuards() {
  if (!window.CMS) return;

  function text(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function imagePath(value) {
    if (typeof value === "string") return value.trim();
    if (!value) return "";

    if (typeof value.get === "function") {
      return text(value.get("path")) || text(value.get("name"));
    }

    return text(value.path) || text(value.name);
  }

  function readableFileName(imageValue) {
    var fileName = imagePath(imageValue).split("/").pop() || "";
    return fileName
      .replace(/\.[^.]+$/, "")
      .replace(/-web$/i, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function fallbackDescription(galleryName, imagePath) {
    var gallery = text(galleryName) || "Custom embroidery";
    var subject = readableFileName(imagePath);

    if (subject) {
      return gallery + ": " + subject + " by Embroidery & Threads";
    }

    return gallery + " by Embroidery & Threads";
  }

  window.CMS.registerEventListener({
    name: "preSave",
    handler: function prepareGalleryRows({ entry }) {
      var data = entry.get("data");
      if (!data || typeof data.update !== "function" || !data.get("gallery")) {
        return data;
      }

      return data.update("gallery", function cleanGalleries(galleries) {
        if (!galleries || typeof galleries.map !== "function") {
          return galleries;
        }

        return galleries.map(function cleanGallery(gallery) {
          var galleryName = gallery.get("name");

          return gallery.update("images", function cleanImages(images) {
            if (
              !images ||
              typeof images.filter !== "function" ||
              typeof images.map !== "function"
            ) {
              return images;
            }

            return images
              .filter(function removeOnlyCompletelyBlankRows(image) {
                return Boolean(image.get("image") || text(image.get("alt")));
              })
              .map(function ensureDescription(image) {
                var selectedImage = image.get("image");
                var description = text(image.get("alt"));

                if (!selectedImage || description.length >= 12) {
                  return image;
                }

                return image.set(
                  "alt",
                  fallbackDescription(galleryName, selectedImage),
                );
              });
          });
        });
      });
    },
  });
})();
