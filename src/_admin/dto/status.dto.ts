export interface StatusDto {
  signal?: number;
  version?: string;
  freeheap?: number;
  cpufreq?: number;
  uptimemillis?: number;
  localtime?: number;
  modemimei?: string;
  simserial?: string;
  modemvlt?: number;
}