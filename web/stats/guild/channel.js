module.exports = (router, main) => {
  router.get('/channel/:channelID(\\d+)', async (req, res, next) => {
    if (!main.api.guilds.get(req.params.guildID).channels.get(req.params.channelID)) {
      res.status(404);
      return res.render('404');
    }

    const Op = main.db.Sequelize.Op;

    let totalMessages = main.db.member_messages.count({
      where: {
        guild_id: req.params.guildID,
        channel_id: req.params.channelID,
        timestamp: {
          [Op.gte]: Date.now() - 24 * 60 * 60 * 1000,
        },
      },
    });

    let userStatsTable = main.db.member_messages.findAll({
      where: {
        guild_id: req.params.guildID,
        channel_id: req.params.channelID,
        timestamp: {
          [Op.gte]: Date.now() - 24 * 60 * 60 * 1000,
        },
      },
      attributes: [
        'user_id',
        [main.db.sequelize.fn('max', main.db.sequelize.col('timestamp')), 'last_message'],
        [main.db.sequelize.fn('sum', main.db.sequelize.col('char_count')), 'char_count'],
        [main.db.sequelize.fn('sum', main.db.sequelize.col('word_count')), 'word_count'],
        [main.db.sequelize.fn('sum', main.db.sequelize.col('user_mention_count')), 'user_mention_count'],
        [main.db.sequelize.fn('sum', main.db.sequelize.col('attachment_count')), 'attachment_count'],
        main.db.sequelize.fn('count', main.db.sequelize.col('message_id')),
      ],
      group: ['user_id'],
      order: [['count', 'desc']],
      limit: 100,
      raw: true,
    });

    let messageGraph = main.db.member_messages.findAll({
      where: {
        guild_id: req.params.guildID,
        channel_id: req.params.channelID,
        timestamp: {
          [Op.gte]: Date.now() - 24 * 60 * 60 * 1000,
          [Op.lte]: Date.now(), // time_bucket_gapfill needs this to make the last two args optional
        },
      },
      attributes: [
        [main.db.sequelize.fn('time_bucket_gapfill', '10 minutes', main.db.sequelize.col('timestamp')), 'name'],
        [main.db.sequelize.fn('coalesce', main.db.sequelize.fn('count', main.db.sequelize.col('message_id')), 0), 'y'],
      ],
      group: ['name'],
      order: [[main.db.sequelize.literal('name'), 'asc']],
      raw: true,
    });

    [
      totalMessages,
      userStatsTable,
      messageGraph,
    ] = await Promise.all([
      totalMessages,
      userStatsTable,
      messageGraph,
    ]);

    for (const row of userStatsTable) {
      const user = await main.api.users.fetch(row.user_id);

      row.avatarURL = user.displayAvatarURL();
      row.tag = user.tag;
      row.id = user.id;

      row.last_message_formatted = main.stringUtils.formatUnixTimestamp(row.last_message, 2, false);
    }

    const channelMembers = main.api.channels.get(req.params.channelID).members;

    return res.render('stats/guild/channel', {
      cards: {
        totalMessages,
        onlineMembers: channelMembers.filter(c => c.presence && c.presence.status !== 'offline').size,
        totalMembers: channelMembers.size,
      },
      diagrams: {
        messageGraph: JSON.stringify(messageGraph),
      },
      userStatsTable,
      pages: [
        {
          text: 'Stats',
          link: '../../..',
        },
        {
          text: main.api.guilds.get(req.params.guildID).name,
          icon: main.api.guilds.get(req.params.guildID).iconURL(),
          link: '..',
        },
        {
          text: `#${main.api.channels.get(req.params.channelID).name}`,
        },
      ],
    });
  });

  return router;
};