module.exports = {
  run: async (main, job) => {
    main.prometheusMetrics.sqlReads.inc(1);

    const jobInformation = await main.db.reminders.findOne({
      where: {
        queue_id: job.id,
      },
    });

    if (!jobInformation) { // huh?
      return false;
    }

    main.prometheusMetrics.sqlWrites.inc(1);

    await main.db.reminders.destroy({
      where: {
        queue_id: job.id,
      },
    });

    const user = await main.userHelper.getUser(false, jobInformation.user_id);

    if (jobInformation.text) {
      return user.send(`Reminder: \`${jobInformation.text}\``);
    }

    return user.send(`Reminder: \`...\`\n\n<https://discordapp.com/channels/${(jobInformation.guild_id) ? jobInformation.guild_id : '@me'}/${jobInformation.channel_id}/${jobInformation.message_id}>`);
  },
};
