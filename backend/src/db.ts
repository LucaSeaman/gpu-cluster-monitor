import pg from 'pg'

const {Pool}  = pg;

export const pool  = new Pool({
    user: process.env.DB_USER||'postgres',
    host: process.env.DB_HOST||'localhost',
    database: process.env.DB_NAME || 'gpu_monitor',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

export const query = (text: string, params?: any[]) =>{
  return pool.query(text, params); 
};