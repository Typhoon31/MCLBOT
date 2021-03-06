const util = require('util');

module.exports = {
  description: 'test1',
  cooldown: false,
  arguments: [
    {
      label: 'testarg',
      type: 'string',
      infinite: true,
    },
  ],
  flags: {
    testflag: {
      label: 'test',
      type: 'string',
      short: 't',
      infinite: true,
    },
  },
  fn: async (ctx, test, flags) => `eval output:\n\`\`\`js\n${util.inspect(test)}\n\`\`\`\n\`\`\`js\n${util.inspect(flags)}\n\`\`\``,
};
