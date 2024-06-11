import { UserProfileDto } from "./user-profile.dto";

export interface OpaAuthzResponseDto {
  user: UserProfileDto | undefined;
  is_admin: boolean;
  allow: boolean;
}