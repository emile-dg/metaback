import {v4 as uuidV4} from "uuid";

import {Service} from "typedi";

import {TUser} from "./users.types";
import {UsersServices} from "./users.services";
import {AppAuthorizationError} from "../../errors/auth";
import AppValidationError from "../../errors/validation";


@Service()
export class UserProvider {

    constructor(private userServices: UsersServices) {
    }


    /**
     *
     * @param email
     */
    public async isEmailTaken(email: string): Promise<boolean> {
        return (await this.userServices.findUserByEmail(email)) !== null;
    }


    /**
     *
     * @param email
     * @param password
     * @param role
     */
    public async createUser(email: string, password: string, role: string = "user"): Promise<TUser> {
        if (await this.isEmailTaken(email))
            throw new AppValidationError({
                key: "email",
                value: email,
            });

        const uid: string = uuidV4();
        return this.userServices.addUser(uid, email, password, role);
    }


    /**
     *
     * @param email
     */
    public async getUserByEmail(email: string): Promise<TUser | null> {
        return await this.userServices.findUserByEmail(email);
    }


    /**
     *
     * @param uid
     */
    public async getUserByUid(uid: string): Promise<TUser | null> {
        return await this.userServices.findUserByUid(uid);
    }


    /**
     *
     * @param userUid
     * @param password
     */
    public async checkUserPassword(userUid: string, password: string): Promise<boolean> {
        return await this.userServices.compareUserPassword(userUid, password);
    }


    /**
     *
     * @param adminUid
     */
    public async getUsers(adminUid: string): Promise<any[]> {
        const adminUserObj = await this.userServices.findUserByUid(adminUid);
        if (!adminUserObj || adminUserObj.role !== "admin") throw new AppAuthorizationError();
        return await this.userServices.getAllUsers();
    }

}