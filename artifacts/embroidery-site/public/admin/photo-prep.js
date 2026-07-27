(function photoPreparationTool() {
  var input = document.getElementById("photo-input");
  var dropZone = document.getElementById("drop-zone");
  var results = document.getElementById("results");
  var status = document.getElementById("status");
  var clearButton = document.getElementById("clear-button");
  var objectUrls = [];
  var maxDimension = 2000;
  var targetBytes = 2_200_000;

  function formatBytes(bytes) {
    if (bytes < 1024 * 1024) {
      return Math.max(1, Math.round(bytes / 1024)) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function safeFileName(name) {
    var stem = name.replace(/\.[^.]+$/, "");
    return (
      (stem
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase() || "embroidery-photo") + "-web.jpg"
    );
  }

  function canvasBlob(canvas, quality) {
    return new Promise(function resolveBlob(resolve, reject) {
      canvas.toBlob(
        function handleBlob(blob) {
          if (blob) resolve(blob);
          else reject(new Error("This browser could not prepare the photo."));
        },
        "image/jpeg",
        quality,
      );
    });
  }

  async function decodePhoto(file) {
    if ("createImageBitmap" in window) {
      return createImageBitmap(file, { imageOrientation: "from-image" });
    }

    return new Promise(function loadImage(resolve, reject) {
      var image = new Image();
      var url = URL.createObjectURL(file);
      image.onload = function loaded() {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = function failed() {
        URL.revokeObjectURL(url);
        reject(new Error("This photo format is not supported by the browser."));
      };
      image.src = url;
    });
  }

  async function preparePhoto(file) {
    var image = await decodePhoto(file);
    var sourceWidth = image.width;
    var sourceHeight = image.height;
    var scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
    var width = Math.max(1, Math.round(sourceWidth * scale));
    var height = Math.max(1, Math.round(sourceHeight * scale));
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("This browser cannot prepare photos.");

    var blob;
    for (var attempt = 0; attempt < 5; attempt += 1) {
      canvas.width = width;
      canvas.height = height;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      blob = await canvasBlob(canvas, Math.max(0.68, 0.86 - attempt * 0.05));
      if (blob.size <= targetBytes) break;
      width = Math.max(800, Math.round(width * 0.86));
      height = Math.max(800, Math.round(height * 0.86));
    }

    if (typeof image.close === "function") image.close();
    return { blob: blob, width: width, height: height };
  }

  function addResult(file, prepared) {
    var url = URL.createObjectURL(prepared.blob);
    objectUrls.push(url);

    var row = document.createElement("article");
    row.className = "result";

    var preview = document.createElement("img");
    preview.src = url;
    preview.alt = "";

    var copy = document.createElement("div");
    copy.className = "result-copy";
    var name = document.createElement("strong");
    name.textContent = safeFileName(file.name);
    var details = document.createElement("span");
    details.textContent =
      prepared.width +
      " x " +
      prepared.height +
      " px | " +
      formatBytes(file.size) +
      " to " +
      formatBytes(prepared.blob.size);
    copy.append(name, details);

    var download = document.createElement("a");
    download.className = "download-link";
    download.href = url;
    download.download = safeFileName(file.name);
    download.textContent = "Download JPG";

    row.append(preview, copy, download);
    results.append(row);
  }

  function addError(file, error) {
    var row = document.createElement("article");
    row.className = "result error";
    row.textContent = file.name + ": " + error.message;
    results.append(row);
  }

  async function handleFiles(fileList) {
    var files = Array.from(fileList).filter(function isImage(file) {
      return file.type.startsWith("image/");
    });
    if (!files.length) {
      status.textContent = "Choose a supported image file.";
      return;
    }

    clearButton.hidden = false;
    status.textContent =
      "Preparing " +
      files.length +
      (files.length === 1 ? " photo..." : " photos...");
    for (var index = 0; index < files.length; index += 1) {
      status.textContent =
        "Preparing photo " + (index + 1) + " of " + files.length + "...";
      try {
        addResult(files[index], await preparePhoto(files[index]));
      } catch (error) {
        addError(
          files[index],
          error instanceof Error ? error : new Error("Preparation failed."),
        );
      }
    }
    status.textContent =
      "Ready. Download each prepared JPG, then upload it in the editor.";
    input.value = "";
  }

  input.addEventListener("change", function inputChanged(event) {
    handleFiles(event.target.files);
  });
  dropZone.addEventListener("dragover", function dragging(event) {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
  });
  dropZone.addEventListener("dragleave", function dragLeft() {
    dropZone.classList.remove("is-dragging");
  });
  dropZone.addEventListener("drop", function dropped(event) {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
    handleFiles(event.dataTransfer.files);
  });
  clearButton.addEventListener("click", function clearResults() {
    objectUrls.forEach(function revoke(url) {
      URL.revokeObjectURL(url);
    });
    objectUrls = [];
    results.replaceChildren();
    clearButton.hidden = true;
    status.textContent = "Select one or more photos to begin.";
  });
})();
