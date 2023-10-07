declare var hunaVersion: string;
declare var hunaEnv: string;
declare var hunaVersionDetails: string;

export const environment = {
  production: true,
  version: hunaVersion,
  env: hunaEnv,
  versionDetails: hunaVersionDetails,
  languages: [
    {
      code: 'en',
      name: 'English',
      default: true
    },
    {
      code: 'ro',
      name: "Română"
    }
  ]
};
