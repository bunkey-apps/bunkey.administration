import Cano from 'cano-koa';
import parser from 'koa-bodyparser';
import logger from 'koa-logger';
import dotenv from 'dotenv';
import cors from '@koa/cors';
import corsOpts from './config/cors';
import errorHandler from './config/error';

dotenv.config();
const app = new Cano(__dirname);

app.use(cors(corsOpts));
app.use(logger());
app.use(errorHandler);
app.use(parser());

process
    .on('SIGINT', () => {
        console.log('SIGINT');
        process.exit(0);
    })
    .on('SIGQUIT', () => {
        console.log('SIGQUIT');
        process.exit(0);
    })
    .on('SIGTERM', () => {
        console.log('SIGTERM');
        process.exit(0);
    });

module.exports = app.up();
