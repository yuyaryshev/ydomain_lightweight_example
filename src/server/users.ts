import { array, boolean, Decoder, object, optional, string, withDefault } from "@mojotech/json-type-validation";
import { readFileSync } from "fs";
import { resolve } from "path";

import { dateDiff, Days } from "ystd";
import { newSecureId, writeFileSyncIfChanged } from "ystd_server";

const isServer = true;

export type AuthTokenKey = string;

export interface AuthToken {
    key: AuthTokenKey;
    validTill: string; // ISO datetime
}

export const decoderAuthToken: Decoder<AuthToken> = object({
    key: string(),
    validTill: string(),
});

export interface UserBase {
    login: string;
    hashed: boolean;
    passOrHash: string;
    passSalt: string;
    projects: string[];
    tokens: AuthToken[];
    workspace: string | undefined;
}

export const decoderUser: Decoder<UserBase> = object({
    login: string(),
    hashed: withDefault(false, boolean()),
    passOrHash: withDefault("", string()),
    passSalt: withDefault("", string()),
    projects: withDefault([], array(string())),
    tokens: withDefault([], array(decoderAuthToken)),
    workspace: optional(string()),
});

export interface UsersMap {
    [key: string]: UserBase;
}

export const decoderUsers: Decoder<UserBase[]> = array(decoderUser);

export let users: UsersMap = {};

export const getUser = (login: string) => {
    return users[login.toUpperCase()];
};

export const createUserToken = async (u: UserBase): Promise<AuthToken> => {
    if (!u.tokens) u.tokens = [];
    const t = {
        key: await newSecureId(),
        validTill: new Date().toISOString(),
    } as AuthToken;
    u.tokens.push(t);
    await writeUsersJson();
    return t;
};

let lastUsersStr: string = "";
const usersPath = resolve("../../../../src/AppIde/users.json");
export const readUsersJson = async () => {
    if (!isServer) return;
    try {
        const newUsersStr = await readFileSync(usersPath, "utf-8");
        if (newUsersStr !== lastUsersStr) {
            lastUsersStr = newUsersStr;
            let newUsersArray: UserBase[] = JSON.parse(newUsersStr);
            let newUsers: UsersMap = {};
            decoderUsers.runWithException(newUsersArray);
            for (let u of newUsersArray) {
                newUsers[u.login.toUpperCase()] = u;
            }

            users = newUsers;
            console.log(`CODE00000139 Read users from ${usersPath} - OK`);
        }
    } catch (e) {
        console.error(`CODE00000140 Failed to read users from ${usersPath}`, e);
    }
};

export const writeUsersJson = async () => {
    await readUsersJson();
    const content = JSON.stringify(Object.values(users), undefined, "    ");
    lastUsersStr = content;
    await writeFileSyncIfChanged(usersPath, content);
};

export const usersRegularwork = async () => {
    let hasChanges: boolean = false;
    for (let u of Object.values(users)) {
        if (!u.projects) {
            u.projects = [];
            hasChanges = true;
        }

        if (!u.tokens) {
            u.tokens = [];
            hasChanges = true;
        }

        for (let ti = 0; ti < u.tokens.length; ti++) {
            if (dateDiff(new Date(), u.tokens[ti].validTill) / Days > 7) {
                // token expired
                u.tokens.splice(ti, 1);
                ti--;
                hasChanges = true;
            }
        }
    }
};

const readUserJsonTimer = async () => {
    await readUsersJson();
    await usersRegularwork();
    setTimeout(readUserJsonTimer, 5000);
};

if (isServer) readUserJsonTimer();
