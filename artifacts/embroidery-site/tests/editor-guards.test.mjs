import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

class FakeMap {
  constructor(values) {
    this.values = values;
  }

  get(key) {
    return this.values[key];
  }

  set(key, value) {
    return new FakeMap({ ...this.values, [key]: value });
  }

  update(key, updateValue) {
    return this.set(key, updateValue(this.get(key)));
  }
}

class FakeList {
  constructor(values) {
    this.values = values;
  }

  filter(predicate) {
    return new FakeList(this.values.filter(predicate));
  }

  map(transform) {
    return new FakeList(this.values.map(transform));
  }
}

function row(values) {
  return new FakeMap(values);
}

async function loadPreSaveHandler() {
  const source = await readFile(
    path.join(appRoot, "public", "admin", "editor-guards.js"),
    "utf8",
  );
  let registration;
  const window = {
    CMS: {
      registerEventListener(value) {
        registration = value;
      },
    },
  };

  vm.runInNewContext(source, { window });
  assert.equal(registration?.name, "preSave");
  return registration.handler;
}

test("gallery save keeps uploaded photos and fills missing descriptions", async () => {
  const handler = await loadPreSaveHandler();
  const data = row({
    gallery: new FakeList([
      row({
        name: "Seasonal & Holiday",
        images: new FakeList([
          row({
            image: "/uploads/christmas-sweatshirt-web.jpg",
            alt: "",
          }),
          row({
            image: "/uploads/winter-beanie.jpg",
            alt: "Pink embroidered winter beanie",
          }),
          row({ image: "", alt: "" }),
        ]),
      }),
    ]),
  });

  const result = handler({
    entry: row({ data }),
  });
  const images = result.get("gallery").values[0].get("images").values;

  assert.equal(images.length, 2);
  assert.equal(
    images[0].get("alt"),
    "Seasonal & Holiday: christmas sweatshirt by Embroidery & Threads",
  );
  assert.equal(images[1].get("alt"), "Pink embroidered winter beanie");
});

test("gallery save does not hide an incomplete nonblank row", async () => {
  const handler = await loadPreSaveHandler();
  const data = row({
    gallery: new FakeList([
      row({
        name: "Custom Orders",
        images: new FakeList([
          row({ image: "", alt: "Waiting for the selected product photo" }),
        ]),
      }),
    ]),
  });

  const result = handler({
    entry: row({ data }),
  });

  assert.equal(result.get("gallery").values[0].get("images").values.length, 1);
});
