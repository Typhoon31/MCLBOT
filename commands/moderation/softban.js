module.exports = {
  desc: 'softly bans an user from the server (banning a member for deleting his/her messages and unbanning directly afterwards)',
  permission: 'BAN_MEMBERS',
  guildOnly: true,
  arguments: [
    {
      label: 'member',
      type: 'member',
    },
    {
      label: 'days',
      type: 'integer',
      skip: true,
      optional: true,
    },
    {
      label: 'reason',
      type: 'string',
      infinite: true,
      optional: true,
    },
  ],
  fn: async (ctx, member, days, reason) => {
    if (member.user.id === ctx.main.api.user.id) {
      return 'Sorry, but I cannot softban myself.';
    }

    if (!member.bannable) {
      return `Sorry, but the member \`${member.user.tag}\` is not bannable.`;
    }

    const msg = await ctx.reply(`Do you really want to softban the member \`${member.user.tag}\`?`);

    const confirm = ctx.main.confirmationHelper.initConfirm(msg, ctx.author);

    confirm.on('timeout', () => {
      msg.edit(`Softban of member \`${member.user.tag}\` cancelled, due to input timeout.`);
    });

    confirm.on('false', () => {
      msg.edit(`Softban of member \`${member.user.tag}\` cancelled.`);
    });

    confirm.on('true', async () => {
      await member.ban({ days, reason });

      await ctx.guild.unban(member, 'Ban removal for softban');

      msg.edit(`Member \`${member.user.tag}\` has been softbanned.`);
    });

    return true;
  },
};
