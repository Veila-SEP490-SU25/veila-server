import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const logger = new Logger('HTTP Request', { timestamp: true });
        const { method, originalUrl } = req;
        const origin = req.get('origin') || req.get('host');
        res.on('finish', () => {
            const { statusCode } = res;
            logger.log(
                `${origin} - ${method} ${originalUrl} - ${statusCode}`,
            );
        });
        next();
    }
}