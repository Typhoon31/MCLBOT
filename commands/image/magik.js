module.exports = {
  alias: ['imagemagic', 'imagemagick', 'magic', 'magick', 'cas', 'liquid'],
  description: 'Rescales an image with seam-carving multiple times leading to image distortion',
  arguments: [
    {
      label: 'url | user | emoji',
      type: 'image',
      optional: true,
    },
  ],
  fn: async (ctx, image) => ctx.main.imageHelper.fAPI(ctx, 'evalmagik', {
    images: [image],
    args: {
      text: [
        '-liquid-rescale',
        '50%',
        '-liquid-rescale',
        '150%',
      ],
    },
  }),
};
