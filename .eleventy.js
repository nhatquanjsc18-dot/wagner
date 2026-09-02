module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/banner-hero.jpg": "banner-hero.jpg" });
  eleventyConfig.addPassthroughCopy({ "src/powder-gun.jpg": "powder-gun.jpg" });

  eleventyConfig.addFilter("money", function (value) {
    if (!value) return "Liên hệ báo giá";
    return value;
  });

  eleventyConfig.addFilter("byCategory", function (products, category) {
    return (products || []).filter((p) => p.category === category);
  });

  eleventyConfig.addFilter("uniqueSubcats", function (products, category) {
    const seen = new Map();
    (products || [])
      .filter((p) => p.category === category)
      .forEach((p) => {
        if (!seen.has(p.subCat)) seen.set(p.subCat, p.subCatLabel);
      });
    return Array.from(seen, ([key, label]) => ({ key, label }));
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
