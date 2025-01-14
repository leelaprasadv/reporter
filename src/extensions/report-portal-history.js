const { getSuiteHistory, getLastLaunchByName, getLaunchDetails } = require('../helpers/report-portal');

async function getLaunchHistory(inputs) {
  if (!inputs.launch_id && inputs.launch_name) {
    const launch = await getLastLaunchByName(inputs);
    inputs.launch_id = launch.id;
  }
  if (typeof inputs.launch_id === 'string') {
    const launch = await getLaunchDetails(inputs);
    inputs.launch_id = launch.id;
  }
  const response = await getSuiteHistory(inputs);
  if (response.content.length > 0) {
    return response.content[0].resources;
  }
  return [];
}

function getSymbols(launches) {
  const symbols = [];
  for (let i = 0; i < launches.length; i++) {
    const launch = launches[i];
    if (launch.status === 'PASSED') {
      symbols.push('✅');
    } else if (launch.status === 'FAILED') {
      symbols.push('❌');
    } else {
      symbols.push('⚠️');
    }
  }
  return symbols;
}

function attachForTeams(payload, symbols) {
  payload.body.push({
    "type": "TextBlock",
    "text": `Last ${symbols.length} Runs`,
    "isSubtle": true,
    "weight": "bolder",
    "separator": true
  });
  payload.body.push({
    "type": "TextBlock",
    "text": symbols.join(' ')
  });
}

function attachForSlack(payload, symbols) {
  payload.blocks.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `*Last ${symbols.length} Runs*\n\n${symbols.join(' ')}`
    }
  });
}

async function run({ extension, target, payload }) {
  try {
    extension.inputs = Object.assign({}, default_inputs, extension.inputs);
    const launches = await getLaunchHistory(extension.inputs);
    const symbols = getSymbols(launches);
    if (symbols.length > 0) {
      if (target.name === 'teams') {
        attachForTeams(payload, symbols);
      } else {
        attachForSlack(payload, symbols);
      }
    }
  } catch (error) {
    console.log('Failed to get report portal history');
    console.log(error);
  }
}

const default_inputs = {
  history_depth: 5
}

const default_options = {
  hook: 'end',
  condition: 'fail'
}

module.exports = {
  run,
  default_options
}