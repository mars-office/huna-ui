import axios from "axios";
import { UserProfileDto } from "../dto/user-profile.dto";
import { OpaResponse } from "../dto/opa-response";
import { OpaRequest } from "../dto/opa-request";
import { OpaAuthzResponseDto } from "../dto/opa-authz-response.dto";
import { OpaPublicAuthzRequestDto } from "../dto/opa-public-authz-request.dto";

export const opaService = {
  publicAuthz: async (authToken: string) => {
    const dto: OpaRequest<OpaPublicAuthzRequestDto> = {
      input: {
        headers: {
          authorization: 'Bearer ' + authToken
        }
      }
    };
    const opaResponse = (await axios.post<OpaResponse<OpaAuthzResponseDto>>('/api/opa/v1/data/com/huna/public_authz', dto)).data;
    return {...opaResponse.result!.user, isAdmin: opaResponse.result!.is_admin} as UserProfileDto;
  }
};

export default opaService;