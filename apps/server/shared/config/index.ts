import * as dotenv from 'dotenv';
dotenv.config();

interface ConfigI {
  db: {
    url: string;
  };
  jwt: {
    secret: string;
  };
}

export const config: ConfigI = {
  db: {
    url: process.env.DB_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'cdcddc',
  },
};
