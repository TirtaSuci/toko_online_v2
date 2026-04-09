export type SessionType = {
    user: {
        id: string;
        name: string;
        email: string;
        image: string;
        role: string;
    };
    accessToken: string;
};