import {Service} from "typedi";
import {TUser} from "./users.types";
import User from "./users.models";
import bcrypt from "bcrypt";


@Service()
export class UsersServices {


    /**
     *
     * @param userDocument
     */
    serializeUserDocument(userDocument: any): TUser {
        return {
            uid: userDocument.uid,
            role: userDocument.role,
            email: userDocument.email,
            createdAt: userDocument.createdAt,
            updatedAt: userDocument.updatedAt,
        }
    }


    /**
     *
     * @param uid
     * @param email
     * @param password
     * @param role
     */
    public async addUser(uid: string, email: string, password: string, role: string): Promise<TUser> {
        const user = new User({uid, email, password, role});
        await user.save();
        return this.serializeUserDocument(user);
    }


    /**
     *
     */
    public async getAllUsers(): Promise<TUser[]> {
        const users = await User.find({});
        return users.map(userDoc => this.serializeUserDocument(userDoc));
    }


    /**
     *
     */
    public async findUserByEmail(email: string): Promise<TUser | null> {
        const user = await User.findOne({email});
        if (!user) return null;
        return this.serializeUserDocument(user);
    }


    /**
     *
     */
    public async findUserByUid(uid: string): Promise<TUser | null> {
        const user = await User.findOne({uid});
        if (!user) return null;
        return this.serializeUserDocument(user);
    }


    /**
     *
     * @param userUid
     * @param password
     */
    public async compareUserPassword(userUid: string, password: string): Promise<boolean> {
        const user = await User.findOne({uid: userUid});
        if (!user) return false;
        return await bcrypt.compare(password, user.password);
    }

}