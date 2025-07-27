import * as dotenv from 'dotenv'
dotenv.config();

interface ConfigI {
  db: {
    url: string;
  };
  jwt: {
    access_secret: string;
    refresh_secret: string;
  };
}

export const config: ConfigI = {
  db: {
    url: process.env.DB_URL || '',
  },
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET || 'cdcddc',
    refresh_secret: process.env.JWT_REFRESH_SECRET || 'dvvdfdvf',
  },
};
