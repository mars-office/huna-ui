export interface OpaUserRequestDto {
  type: 'oauth',
  url: string,
  service: 'ui',
  headers: {
    authorization: string
  }
}