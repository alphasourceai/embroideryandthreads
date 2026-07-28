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

  function enableLocalImagePreviews() {
    if (
      typeof document === "undefined" ||
      typeof MutationObserver === "undefined" ||
      typeof URL === "undefined" ||
      typeof URL.createObjectURL !== "function"
    ) {
      return;
    }

    var previewsByName = Object.create(null);

    function fileNameFromSource(source) {
      if (typeof source !== "string" || source.startsWith("blob:")) return "";

      try {
        return decodeURIComponent(source.split(/[?#]/)[0].split("/").pop());
      } catch {
        return "";
      }
    }

    function applyPreview(image) {
      var fileName = fileNameFromSource(image.getAttribute("src"));
      var preview = fileName && previewsByName[fileName];
      if (!preview || image.src === preview) return;

      image.src = preview;
    }

    function refreshPreviews(root) {
      if (root instanceof HTMLImageElement) {
        applyPreview(root);
      }

      if (root && typeof root.querySelectorAll === "function") {
        root.querySelectorAll("img").forEach(applyPreview);
      }
    }

    document.addEventListener(
      "change",
      function rememberSelectedImages(event) {
        var input = event.target;
        if (
          !(input instanceof HTMLInputElement) ||
          input.type !== "file" ||
          !input.files
        ) {
          return;
        }

        Array.from(input.files).forEach(function rememberImage(file) {
          if (!file.type.startsWith("image/")) return;

          if (previewsByName[file.name]) {
            URL.revokeObjectURL(previewsByName[file.name]);
          }
          previewsByName[file.name] = URL.createObjectURL(file);
        });

        requestAnimationFrame(function showSelectedImages() {
          refreshPreviews(document);
        });
      },
      true,
    );

    new MutationObserver(function previewNewImages(mutations) {
      mutations.forEach(function inspectMutation(mutation) {
        if (
          mutation.type === "attributes" &&
          mutation.target instanceof HTMLImageElement
        ) {
          applyPreview(mutation.target);
        }

        mutation.addedNodes.forEach(refreshPreviews);
      });
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["src"],
      childList: true,
      subtree: true,
    });

    window.addEventListener("beforeunload", function releasePreviews() {
      Object.values(previewsByName).forEach(URL.revokeObjectURL);
    });
  }

  enableLocalImagePreviews();
})();
