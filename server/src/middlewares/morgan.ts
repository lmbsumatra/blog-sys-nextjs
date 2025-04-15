import morgan from 'morgan';
import logger from '../utils/logger';

const stream = {
  write: (message: string) => {
    logger.http(message.trim()); // 
  }
};

// middleware: catches all http logs
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream // log sent to stream var
    // skip: [condition here e.g.: (req, res) => req.method !== 'GET']
   } 
);

export default morganMiddleware;
