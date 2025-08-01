import { devConfig } from './dev';
import { prodConfig } from './prod';

const config = import.meta.env.PROD ? prodConfig : devConfig;

export default config;
export { devConfig, prodConfig }; 