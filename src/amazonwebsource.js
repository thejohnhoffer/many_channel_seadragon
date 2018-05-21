import AWS from 'aws-sdk';

/**
 * Get AWS URL and Authorization Headers
 * @param {Object} keywords: SessionToken, AccessKeyId, SecretAccessKey
 * @param {string} bucket: s3 bucket
 * @param {string} file: s3 file
 */
module.exports = function(keywords, bucket, key) {

	var credentials = new AWS.Credentials({
    accessKeyId: keywords.AccessKeyId,
    secretAccessKey: keywords.SecretAccessKey,
    sessionToken: keywords.SessionToken,
	});

  var config = new AWS.Config({
		credentials: credentials,
    region: 'us-east-1'
  });

	AWS.config.credentials = credentials;

	// Wait for credentials
	const getCredentials = () => {
		return new Promise((resolve, reject) => {
			AWS.config.credentials.get(err => err ? reject(err) : resolve());
		});
	};


	const getObject = (bucket, key) => {

		return new Promise((resolve, reject) => {
			// In this case, supplying credential is redundant, but soon the credentials
			// used for accessing S3 and the credentials the user has as a part of their
			// AWS Cognito user account will be different.
			const s3 = new AWS.S3({ credentials: AWS.config.credentials });
			const params = { Bucket: bucket, Key: key };
			s3.getObject(params, (err, data) => err ? reject(err) : resolve(data));
		});
	};

	getCredentials()
		.then(() => getObject(bucket, key))
		.then(obj => console.log(obj))
		.catch(err => console.error(err));
}

