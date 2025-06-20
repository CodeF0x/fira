export interface UserModel {
    id: number;
    displayName: string;
    email: string;
}

export type User = Readonly<UserModel>;
export type Users = UserModel[];
