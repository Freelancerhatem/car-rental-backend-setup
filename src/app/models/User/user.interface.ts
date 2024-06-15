export type TUser = {
    name: string;
    email: string;
    role: 'user' | 'admin';
    password: string;
    phone: string;
    address: string;
    comparePassword: (password: string) => Promise<boolean>;
}