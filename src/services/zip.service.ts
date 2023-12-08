import { AsyncZippable, zip } from 'fflate';

export const zipService = {
  zipFiles: async (
    filesMap: { [key: string]: string },
    compressionLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 | undefined = 0,
  ) => {
    const textEncoder = new TextEncoder();
    const uint8Map: AsyncZippable = {};
    for (const fileName of Object.keys(filesMap)) {
      uint8Map[fileName] = textEncoder.encode(filesMap[fileName]);
    }
    return await new Promise<Blob>((accept, reject) => {
      zip(
        uint8Map,
        {
          level: compressionLevel,
        },
        (e, z) => {
          if (e) {
            reject(e);
            return;
          }
          accept(new Blob([z]));
        },
      );
    });
  },
};

export default zipService;
