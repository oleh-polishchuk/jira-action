const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');
const util = require('util');

const transitIssue = async (issueCode, transitionId) => {
    const username = core.getInput('atlassian-basic-auth-username');
    const password = core.getInput('atlassian-basic-auth-password');

    const data = JSON.stringify({
        "transition": {
            "id": transitionId
        }
    });

    const config = {
        method: 'post',
        url: `https://buyinglabs.atlassian.net/rest/api/latest/issue/${issueCode}/transitions`,
        headers: {
            'Authorization': `Basic ${Buffer.from(username + ':' + password).toString('base64')}`,
            'Content-Type': 'application/json'
        },
        data : data
    };

    return axios(config);
}

export async function run() {
    try {
        console.log('==> github.event:', util.inspect(github.context, false, 2, true));

        const pattern = core.getInput('pattern-to-match');

        const body = github.context.payload.pull_request.body;
        console.log('==> body', body);
        const regex = new RegExp(pattern, 'gm');
        console.log('==> regex', regex);
        const res = regex.exec(body);
        console.log('==> res', res);
        if (res && res.groups && res.groups.issue) {
            const transitionId = core.getInput('on-success-transition-id');
            await transitIssue(res.groups.issue, transitionId);
        } else {
            const transitionId = core.getInput('on-fail-transition-id');
            await transitIssue(res.groups.issue, transitionId);
            core.setFailed("Jira issue url is required");
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()
