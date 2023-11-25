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
  hunaVersion: import.meta.env.DEV ? "debug" : (window as any).hunaVersion as string,
  hunaEnv: import.meta.env.DEV ? "local" : (window as any).hunaEnv as string,
  hunaVersionDetails: import.meta.env.DEV ? "debug" : (window as any).hunaVersionDetails as string,
};

export default environment;