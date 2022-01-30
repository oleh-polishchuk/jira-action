const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');

export async function run() {
    try {
        const username = core.getInput('atlassian-basic-auth-username');
        const password = core.getInput('atlassian-basic-auth-password');

        const onSuccessTransitionId = core.getInput('on-success-transition-id');
        const onFailTransitionId = core.getInput('on-fail-transition-id');

        console.log(`==> username: ${username}`);
        console.log(`==> password: ${password}`);
        console.log(`==> onSuccessTransitionId: ${onSuccessTransitionId}`);
        console.log(`==> onFailTransitionId: ${onFailTransitionId}`);

        const data = JSON.stringify({
            "transition": {
                "id": onSuccessTransitionId
            }
        });

        console.log(`==> data: ${data}`);

        const config = {
            method: 'post',
            url: 'https://buyinglabs.atlassian.net/rest/api/latest/issue/BP-9691/transitions',
            headers: {
                'Authorization': `Basic ${Buffer.from(username + ':' + password).toString('base64')}`,
                'Content-Type': 'application/json'
            },
            data : data
        };

        console.log(`==> config: ${config}`);

        const response = await axios(config)

        core.setOutput("response", response);
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`==> The event payload: ${payload}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()
