export const environment = {
  i18n: {
    languages: [
      {
        code: 'ro',
        name: 'Română'
      },
      {
        code: 'en',
        name: 'English',
        default: true
      }
    ]
  },
  hunaVersion: import.meta.env.DEV ? "debug" : (window as any).hunaVersion,
  hunaEnv: import.meta.env.DEV ? "local" : (window as any).hunaEnv,
  hunaVersionDetails: import.meta.env.DEV ? "debug" : (window as any).hunaVersionDetails,

};

export default environment;