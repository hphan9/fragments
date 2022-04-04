// if the environment sets an AWS Region, we will use AWS backend
// services(S3,DynamoDB); otherwise we will use an in-memory DB.

module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');
