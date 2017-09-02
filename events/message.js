module.exports = {
  fn: (main, message) => {
    if (message.channel.type !== 'dm' && !message.author.bot) {
      main.prometheusMetrics.sqlWrites.inc();

      main.db.member_message.upsert({
        server_id: message.guild.id,
        user_id: message.author.id,
        channel_id: message.channel.id,
        message_id: message.id,
        char_count: message.content.length,
        word_count: (message.content.length) ? message.content.split(' ').length : 0,
        user_mention_count: message.mentions.members.size + message.mentions.roles.size + ((message.mentions.everyone) ? message.guild.memberCount : 0),
        attachment_count: message.attachments.size,
      });
    }

    main.commandHandler.handleMessageEvent(message);

    // REPL CODE HERE
  },
};
