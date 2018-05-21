''' aws credentiasl as query params '''
import os
import sys
import json


def make_credentials():
    ''' parse results of aws command '''
    response = os.popen('aws sts get-session-token').read()
    credentials = json.loads(response)['Credentials']

    for k in ['SessionToken', 'AccessKeyId', 'SecretAccessKey']:
        yield 'aws{}={}'.format(k, credentials[k])

content = '&'.join(list(make_credentials()))

if len(sys.argv) > 1:
    url_format = sys.argv[1]
else:
    url_format = '?{}'

print(url_format.format(content))
