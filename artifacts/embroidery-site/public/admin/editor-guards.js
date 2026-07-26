(function registerEditorGuards() {
  if (!window.CMS) return;

  window.CMS.registerEventListener({
    name: "preSave",
    handler: function removeBlankGalleryRows({ entry }) {
      var data = entry.get("data");
      if (
        !data ||
        typeof data.update !== "function" ||
        !data.get("gallery")
      ) {
        return data;
      }

      return data.update("gallery", function cleanGalleries(galleries) {
        if (!galleries || typeof galleries.map !== "function") {
          return galleries;
        }

        return galleries.map(function cleanGallery(gallery) {
          return gallery.update("images", function cleanImages(images) {
            if (!images || typeof images.filter !== "function") {
              return images;
            }

            return images.filter(function hasImageAndDescription(image) {
              return Boolean(image.get("image") && image.get("alt"));
            });
          });
        });
      });
    },
  });
})();
