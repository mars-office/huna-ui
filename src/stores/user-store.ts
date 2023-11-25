import { User } from "oidc-react";
import { BehaviourSubject } from "../helpers/behaviour-subject";

export const userStore = new BehaviourSubject<User | undefined>(undefined);