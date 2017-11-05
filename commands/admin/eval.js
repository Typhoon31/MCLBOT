const util = require('util');

module.exports = {
  desc: 'Runs the text via JavaScript\'s eval',
  hide: true,
  owner: true,
  arguments: [
    {
      label: 'code',
      type: 'string',
      infinite: true,
    },
  ],
  fn: (context, code) => {
    let evalOutput;
    let retMsg;

    const start = Date.now();

    try {
      evalOutput = eval(code);
    } catch (err) {
      return `There was an error while eval-ing your input:\n\`\`\`\n${err}\n\`\`\``;
    }

    const time = Date.now() - start;

    // if (evalOutput === undefined) {
    //   retMsg = 'eval output:\n```JSON\nundefined\n```';
    // } else if (evalOutput === null) {
    //   retMsg = 'eval output:\n```JSON\nnull\n```';
    // } else if (typeof evalOutput === 'object') {
    //   try {
    //     // evalOutput = JSON.stringify(evalOutput, null, 2);
    //     evalOutput = util.inspect(evalOutput);
    //
    //     retMsg = `eval output:\n\`\`\`js\n${evalOutput}\n\`\`\``;
    //   } catch (err) {
    //     retMsg = `There was an error while eval-ing your input:\n\`\`\`\n${err.message}\n\`\`\``;
    //   }
    // } else {
    //   retMsg = `eval output:\n\`\`\`\n${evalOutput.toString()}\n\`\`\``;
    // }
    //
    // retMsg = `${retMsg} \ntype: ${typeof evalOutput} | :stopwatch: took ${time}ms`;

    // return retMsg;

    return `eval output:\n\`\`\`js\n${util.inspect(evalOutput)}\n\`\`\` \ntype: ${typeof evalOutput} | :stopwatch: took ${time}ms`;
  },
};