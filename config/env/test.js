module.exports = {
  env: 'test',
  db: process.env.OPENSHIFT_MONGODB_DB_URL + 'apieja',
  port: process.env.OPENSHIFT_NODEJS_PORT,
  address: process.env.OPENSHIFT_NODEJS_IP,
  domain: 'localhost'
};
