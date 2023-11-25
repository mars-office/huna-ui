import { BehaviourSubject } from '../helpers/behaviour-subject';
import { User } from 'oidc-client-ts';

export const userStore = new BehaviourSubject<User | undefined>(undefined);
