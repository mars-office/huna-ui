import axios from "axios";
import { UserProfileDto } from "../dto/user-profile.dto";
import { OpaResponse } from "../dto/opa-response";
import { OpaRequest } from "../dto/opa-request";
import { OpaUserRequestDto } from "../dto/opa-user-request.dto";
import { OpaAuthzResponseDto } from "../dto/opa-authz-response.dto";

export const usersService = {
  myProfile: async (authToken: string) => {
    const dto: OpaRequest<OpaUserRequestDto> = {
      input: {
        url: '/',
        type: 'oauth',
        service: 'ui',
        headers: {
          authorization: 'Bearer ' + authToken
        }
      }
    };
    const opaResponse = (await axios.post<OpaResponse<OpaAuthzResponseDto>>('/api/opa/authz', dto)).data;
    return {...opaResponse.result!.user, isAdmin: opaResponse.result!.is_admin} as UserProfileDto;
  }
};

export default usersService;