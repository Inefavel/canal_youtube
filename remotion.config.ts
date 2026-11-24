import {Config} from '@remotion/cli/config';

Config.setEntryPoint('./src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
// Qualidade alta para upload no YouTube (quanto menor o CRF, maior a qualidade).
Config.setCrf(18);
// Opcional: usar um Chrome/Chromium já instalado (ex.: em servidores/CI sem download).
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
