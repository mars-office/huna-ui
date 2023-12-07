import { UserProfileDto } from '../dto/user-profile.dto';
import { BehaviourSubject } from '../helpers/behaviour-subject';

export const userProfileStore = new BehaviourSubject<UserProfileDto | undefined>(undefined);