module.exports = {
  fn: (main, member) => {
    if (member.user.bot) {
      return;
    }

    main.db.member_events.upsert({
      user_id: member.id,
      guild_id: member.guild.id,
      type: 'JOIN',
      timestamp: Date.now(),
    });

    main.prometheusMetrics.sqlWrites.inc();
  },
};
