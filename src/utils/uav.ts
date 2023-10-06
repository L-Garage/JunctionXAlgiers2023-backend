import { setupUAV } from './mqtt';

export const uavs = {};

export const getUAV = (id: number) => uavs[id];

setupUAV(uavs);
