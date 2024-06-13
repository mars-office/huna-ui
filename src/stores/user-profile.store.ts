import { UserProfileDto } from '../dto/user-profile.dto';
import { BehaviourSubject } from '../helpers/behaviour-subject';
import { LoadableStore } from '../models/loadable-store';

export const userProfileStore = new BehaviourSubject<LoadableStore<UserProfileDto>>({
  isLoading: true,
  data: undefined
});