import { environment } from 'src/environments/environment';

export const getUiVersion = () => {
  const versionString = environment.versionDetails;
  if (versionString.indexOf('; ') === -1) {
    return versionString;
  }
  return versionString
    .split('; ')[1]
    .split(' ')
    .map((x) => ({ deployable: x.split(':')[0], version: x.split(':')[1] }))
    .find((x) => x.deployable === 'huna-ui')!.version;
};
