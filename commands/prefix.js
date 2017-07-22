const commands = {};

commands.prefix = {
  name: 'prefix',
  optArgs: ['show|set|reset', 'prefix'],
  desc: 'manages the bot\'s command prefix on this server',
  admin: true,
  fn: async (message, params, main) => {
    const prefix = await main.prefixHelper.getServerPrefixFromDB(message.guild.id);

    if (!params[0] || params[0] === 'show') {
      if (prefix) {
        return `The bot's current custom prefix for this server is \`${prefix.prefix}\``;
      }

      return `The bot's default prefix is \`${main.prefixHelper.getDefaultPrefix()}\` (No custom prefix has been set for this server)`;
    } else if (params[0] === 'reset') {
      if (!prefix) {
        return `There's currently no custom prefix set for this server. (The bot's default prefix is\`${main.prefixHelper.getDefaultPrefix()}\`)`;
      }

      await main.prefixHelper.deleteServerPrefix(message.guild.id);
      return `The bot's prefix for this server has been reset to it's default \`${main.prefixHelper.getDefaultPrefix()}\``;
    } else if (params[0] === 'set') {
      if (!params[1]) {
        return main.utils.argumentsError('prefix', 1, 'No custom prefix specified');
      }

      await main.prefixHelper.setServerPrefix(message.guild.id, params[1]);
      return `The bot's custom prefix has been set to \`${params[1]}\` for this server`;
    }
  },
};

module.exports = commands;
