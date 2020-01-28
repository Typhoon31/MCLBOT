module.exports = {
  alias: ['invert'],
  description: 'replace every pixel with its complementary color',
  arguments: [
    {
      label: 'url | user | emoji',
      type: 'image',
      optional: true,
    },
  ],
  fn: async (ctx, image) => ctx.main.imageHelper.processImage(ctx, image, null, '-negate'),
};
