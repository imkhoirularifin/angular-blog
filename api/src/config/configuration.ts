export default () => ({
  db_url: process.env.DB_URL,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expiration: process.env.JWT_EXPIRATION,
});
