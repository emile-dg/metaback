export type TUser = {
    readonly uid: string;
    readonly role: string;
    readonly email: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export type TUserPayload = {
    readonly uid: string;
    readonly email: string;
    readonly role: string;
    readonly iat: number;
    readonly exp: number;
}