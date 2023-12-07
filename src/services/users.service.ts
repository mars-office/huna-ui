import axios from "axios";
import { UserProfileDto } from "../dto/user-profile.dto";

export const usersService = {
  myProfile: async () => {
    return (await axios.get<UserProfileDto>('/api/users/myprofile')).data;
  }
};

export default usersService;