declare var hunaVersion: string;
declare var hunaEnv: string;

export const environment = {
  production: false,
  version: hunaVersion,
  env: hunaEnv,
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
