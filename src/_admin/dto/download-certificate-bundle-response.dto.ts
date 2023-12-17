export interface DownloadCertificateBundleResponseDto {
  clientCertificateKey: string;
  clientCertificateCrt: string;
  letsencryptCaCrt: string;
  caCrt: string;
  _id: string;
}