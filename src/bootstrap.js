import dotenv from 'dotenv';

dotenv.config({
  path: process.env.TEST_RUNGING === 'true' ? '.env.test' : '.env'
});
