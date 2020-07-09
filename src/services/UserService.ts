import AsyncStorage from "@react-native-community/async-storage";
import { User, LoginResponse } from "../interfaces";
import { setTheme } from "../utils";
import jwt_decode from "jwt-decode";
import { Subject } from "rxjs";

export class UserService {
  private static _instance: UserService;
  public user: User | undefined;
  public sub: Subject<{ user: User | undefined }> = new Subject<{
    user: User | undefined;
  }>();

  private constructor() {
    let jwt: string | null = null;
    (async () => {
      jwt = await AsyncStorage.getItem("jwt");
    })();
    if (jwt) {
      this.setUser(jwt);
    } else {
      setTheme();
      console.log("No JWT cookie found.");
    }
  }

  public login(res: LoginResponse) {
    this.setUser(res.jwt);
    AsyncStorage.setItem("jwt", res.jwt);
    console.log("JWT stored");
  }

  public logout() {
    this.user = undefined;
    AsyncStorage.removeItem("jwt");
    setTheme();
    this.sub.next({ user: undefined });
    console.log("Logged out.");
  }

  public get auth(): string {
    let jwt: string | null = null;
    (async () => {
      jwt = await AsyncStorage.getItem("jwt");
    })();
    if (!jwt) throw new Error();
    return jwt;
  }

  private setUser(jwt: string) {
    this.user = jwt_decode(jwt);
    if (this.user) {
      setTheme(this.user.theme, true);
      this.sub.next({ user: this.user });
      console.log(this.user);
    }
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}
