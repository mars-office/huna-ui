declare var hunaVersion: string;

export const environment = {
  production: true,
  version: hunaVersion,
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
