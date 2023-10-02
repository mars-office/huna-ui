declare var hunaVersion: string;

export const environment = {
  production: false,
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
