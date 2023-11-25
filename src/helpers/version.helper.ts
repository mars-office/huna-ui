import environment from "../environment"

export const getHunaUiVersion = () => {
  if (environment.hunaVersionDetails.indexOf('; ') === -1) {
    return environment.hunaVersionDetails;
  }
  return environment.hunaVersionDetails.split('; ')[1].split(' ').map(x => ({deployment: x.split(":")[0], version: x.split(":")[1]}))
    .find(x => x.deployment === 'huna-ui')!.version;
}