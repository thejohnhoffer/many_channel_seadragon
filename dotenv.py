''' aws credentiasl in dotenv '''
import os
import json


def make_credentials():
    ''' parse results of aws command '''
    response = os.popen('aws sts get-session-token').read()

    # Try to read credentials from response
    try:
        credentials = json.loads(response)['Credentials']

        for k in ['SessionToken', 'AccessKeyId', 'SecretAccessKey']:
            yield "{0}={1}".format(k.upper(), credentials[k])

    except json.decoder.JSONDecodeError as e:
        print(e)

content = list(make_credentials())

if content:
    with open('.env', 'w') as env:
        for line in content:
            env.write(line+'\n')
