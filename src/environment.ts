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
  hunaEnv: import.meta.env.DEV ? "local" : (window as any).hunaEnv as string,
  hunaVersion: import.meta.env.DEV ? "local" : (window as any).hunaVersion
};

export default environment;