(function () {
  var h = window.React.createElement;

  function assetUrl(getAsset, value) {
    if (!value) return "";
    var asset = getAsset(value);
    return asset && asset.toString ? asset.toString() : value;
  }

  function SitePreview(props) {
    var data = props.entry.get("data").toJS();
    var gallery = data.gallery || [];
    var reviews = data.reviews || [];
    var pricing = data.pricing || {};

    return h("main", { className: "editor-preview" },
      h("header", { className: "preview-header" },
        h("img", { src: "/logo-b.jpg", alt: "" }),
        h("div", null,
          h("strong", null, "Embroidery & Threads"),
          h("span", null, "Castle Rock, Colorado")
        )
      ),
      h("section", { className: "preview-hero" },
        h("div", null,
          h("small", null, "HANDMADE IN CASTLE ROCK"),
          h("h1", null, "Sewn into ", h("em", null, "every little"), " detail."),
          h("p", null, "A small, faith-based embroidery shop specializing in personalized pieces.")
        ),
        data.hero && h("img", { src: assetUrl(props.getAsset, data.hero.image), alt: data.hero.alt || "" })
      ),
      h("section", { className: "preview-section" },
        h("em", null, "a few favorites"),
        h("h2", null, "The Gallery"),
        h("div", { className: "preview-grid" }, gallery.map(function (item, index) {
          return h("figure", { key: index },
            h("img", { src: assetUrl(props.getAsset, item.image), alt: item.alt || "" }),
            h("figcaption", null, item.alt || "Image description needed")
          );
        }))
      ),
      h("section", { className: "preview-section preview-reviews" },
        h("em", null, "shared with love"),
        h("h2", null, "Customer Stories"),
        h("div", { className: "preview-grid" }, reviews.map(function (review, index) {
          return h("figure", { key: index },
            h("img", { src: assetUrl(props.getAsset, review.image), alt: review.alt || "" }),
            h("figcaption", null, h("strong", null, review.reviewer), h("span", null, review.quote))
          );
        }))
      ),
      pricing.enabled && h("section", { className: "preview-section preview-pricing" },
        h("em", null, pricing.eyebrow),
        h("h2", null, pricing.title),
        h("p", null, pricing.intro),
        (pricing.items || []).map(function (item, index) {
          return h("div", { className: "preview-price", key: index },
            h("span", null, h("strong", null, item.name), item.description),
            h("b", null, item.price)
          );
        })
      )
    );
  }

  window.CMS.registerPreviewTemplate("site_content", SitePreview);
  window.CMS.registerPreviewStyle("/admin/preview.css");
})();
