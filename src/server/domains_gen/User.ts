// Generated by 00000233
import { observable, computed, action, makeObservable } from "mobx";
import { assertNever, newId, ObjectId, deepClone } from "ystd";
import { dataSide_server, dataSide_client, dataSide_db } from "@yuyaryshev/ydomain_common";
import {
    anyJson,
    boolean,
    Decoder,
    array,
    dict,
    object,
    oneOf,
    optional,
    string,
    number,
    union,
    intersection,
    constant,
    tuple,
} from "@mojotech/json-type-validation";

// Generated by 30000037
import { WorkspaceObject } from "./Workspace.js";

// Generated by 00000127
import { MetaRoot } from "@yuyaryshev/ydomain_meta";
import { FieldRef, KeyValue, KeyValueToMsgTranslator } from "@yuyaryshev/object_to_messages_ifc";
import { OdbBase, odbObject } from "@yuyaryshev/odb";
import {
    ObjectRoot,
    DomainObject,
    DomainActionSerialized,
    Domain,
    DataSide,
    isEmptyChange,
    extern_any,
    DataDirection,
} from "@yuyaryshev/ydomain_common";

import { Ysocket, UpstreamChannel } from "@yuyaryshev/ydomain_server";

// Generated by 00000128

import { SessionObject } from "./Session.js";

// Generated by 30000026
export type UserDomain = Domain<UserObject>;

export interface UserObject {
    login: FieldRef<string>;
    workspace: FieldRef<WorkspaceObject | undefined>;
}

export type UserObjectKV = KeyValue<unknown, UserObject>;

// Generated by 30000029
export const UserDomain = {
    id: "f86d1bef-4d1c-4916-af92-17318acea94e",
    name: "User",
    defaultObjectRoot: undefined as ObjectRoot | undefined,

    isMyInstance: (obj: any): obj is UserObject => {
        return typeof obj === "object" && obj.domain === UserDomain;
    },

    // Generated by 30000021
    getOrCreate: (id: ObjectId | undefined): UserObject => {
        if (!UserDomain.defaultObjectRoot)
            throw new Error(
                `CODE00000000 User.getOrCreate You should first set defaultObjectRoot before using getOrCreate or else use getOrCreateEx!`,
            );
        return UserDomain.getOrCreateEx(UserDomain.defaultObjectRoot, id);
    },

    getOrCreateEx: (objectRoot: ObjectRoot, id: ObjectId | undefined): UserObject => {
        if (id && id.split(":")[0] !== "f86d1bef-4d1c-4916-af92-17318acea94e")
            throw new Error(`CODE00000000 User.getOrCreate Incorrect domainId in id = ${id}`);
        if (!id) {
            id = "f86d1bef-4d1c-4916-af92-17318acea94e:" + newId();
        }
        const r = new KeyValueToMsgTranslator<unknown, UserObject>({
            baseTypeMeta: objectRoot.odbConnection.odbBase.__metaRoot.expectType("User"),
            stateReader: objectRoot.odbConnection,
            actionProcessor: objectRoot.stdActionProcessor,
            path: ["User", id],
            createIfNotExists: true,
        });
        return r.asObj();
    },

    // Generated by 30000021
    getOrThrow: (id: ObjectId): UserObject => {
        if (!UserDomain.defaultObjectRoot)
            throw new Error(`CODE00000000 User.getOrThrow You should first set defaultObjectRoot before using getOrThrow or else use getOrThrowEx!`);
        return UserDomain.getOrThrowEx(UserDomain.defaultObjectRoot, id);
    },

    getOrThrowEx: (objectRoot: ObjectRoot, id: ObjectId): UserObject => {
        if (id && id.split(":")[0] !== "f86d1bef-4d1c-4916-af92-17318acea94e")
            throw new Error(`CODE00000000 User.getOrThrow Incorrect domainId in id = ${id}`);
        if (!id) {
            throw new Error(`CODE00000000 User.getOrThrow id is empty!`);
        }
        const r = new KeyValueToMsgTranslator<unknown, UserObject>({
            baseTypeMeta: objectRoot.odbConnection.odbBase.__metaRoot.expectType("User"),
            stateReader: objectRoot.odbConnection,
            actionProcessor: objectRoot.stdActionProcessor,
            path: ["User", id],
            createIfNotExists: true,
        });
        return r.asObj();
    },

    // Generated by 30000021
    getOrUndefined: (id: ObjectId | undefined): UserObject | undefined => {
        if (!UserDomain.defaultObjectRoot)
            throw new Error(
                `CODE00000000 User.getOrUndefined You should first set defaultObjectRoot before using getOrUndefined or else use getOrUndefinedEx!`,
            );
        return UserDomain.getOrUndefinedEx(UserDomain.defaultObjectRoot, id);
    },

    getOrUndefinedEx: (objectRoot: ObjectRoot, id: ObjectId | undefined): UserObject | undefined => {
        if (id && id.split(":")[0] !== "f86d1bef-4d1c-4916-af92-17318acea94e")
            throw new Error(`CODE00000000 User.getOrUndefined Incorrect domainId in id = ${id}`);
        if (!id) {
            return undefined;
        }
        const r = new KeyValueToMsgTranslator<unknown, UserObject>({
            baseTypeMeta: objectRoot.odbConnection.odbBase.__metaRoot.expectType("User"),
            stateReader: objectRoot.odbConnection,
            actionProcessor: objectRoot.stdActionProcessor,
            path: ["User", id],
            createIfNotExists: true,
        });
        return r.asObj();
    },

    // Generated by 30000025
    verifyPermissions: (objectRoot: ObjectRoot, object: UserObject, domainAction: DomainActionSerialized): boolean => {
        return true;
    },

    // Generated by 30000050
    beforeSendAction: (
        objectRoot: ObjectRoot,
        object: UserObject,
        domainAction: DomainActionSerialized,
        targetDataSide: DataSide,
        destSession: SessionObject | undefined,
    ): DomainActionSerialized | undefined => {
        let cloned: true | undefined;
        let change = domainAction;

        //-------------------------------------------- Custom code start --------------------------------------------
        if (false)
            // destSession
            return undefined;
        //-------------------------------------------- Custom code end --------------------------------------------

        return change;
    },
};
