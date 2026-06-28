import pg from 'pg'

const {Pool}  = pg;

export const pool  = new Pool({
    /*user: process.env.DB_USER||'postgres',
    host: process.env.DB_HOST||'localhost',
    database:,
    password:,
    port: ,
    max: ,
    idleTimeoutMillis: ,
    connectionTimeoutMillis: ,
*/
});
