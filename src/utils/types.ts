import { Request } from 'express';
import { TokenPayload } from './jwt';

export type ExpressRequest = Request & { user?: TokenPayload };
