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
export type PersonDomain = Domain<PersonObject>;

export interface PersonObject {
    name: FieldRef<string>;
    a: FieldRef<string>;
    b: FieldRef<string>;
}

export type PersonObjectKV = KeyValue<unknown, PersonObject>;

// Generated by 30000029
export const PersonDomain = {
    id: "3d5c8d20-3024-4537-8dca-64cd241b9a92",
    name: "Person",
    defaultObjectRoot: undefined as ObjectRoot | undefined,

    isMyInstance: (obj: any): obj is PersonObject => {
        return typeof obj === "object" && obj.domain === PersonDomain;
    },

    // Generated by 30000021
    getOrCreate: (id: ObjectId | undefined): PersonObject => {
        if (!PersonDomain.defaultObjectRoot)
            throw new Error(
                `CODE00000000 Person.getOrCreate You should first set defaultObjectRoot before using getOrCreate or else use getOrCreateEx!`,
            );
        return PersonDomain.getOrCreateEx(PersonDomain.defaultObjectRoot, id);
    },

    getOrCreateEx: (objectRoot: ObjectRoot, id: ObjectId | undefined): PersonObject => {
        if (id && id.split(":")[0] !== "3d5c8d20-3024-4537-8dca-64cd241b9a92")
            throw new Error(`CODE00000000 Person.getOrCreate Incorrect domainId in id = ${id}`);
        if (!id) {
            id = "3d5c8d20-3024-4537-8dca-64cd241b9a92:" + newId();
        }
        const r = new KeyValueToMsgTranslator<unknown, PersonObject>({
            baseTypeMeta: objectRoot.odbConnection.odbBase.__metaRoot.expectType("Person"),
            stateReader: objectRoot.odbConnection,
            actionProcessor: objectRoot.stdActionProcessor,
            path: ["Person", id],
            createIfNotExists: true,
        });
        return r.asObj();
    },

    // Generated by 30000021
    getOrThrow: (id: ObjectId): PersonObject => {
        if (!PersonDomain.defaultObjectRoot)
            throw new Error(
                `CODE00000000 Person.getOrThrow You should first set defaultObjectRoot before using getOrThrow or else use getOrThrowEx!`,
            );
        return PersonDomain.getOrThrowEx(PersonDomain.defaultObjectRoot, id);
    },

    getOrThrowEx: (objectRoot: ObjectRoot, id: ObjectId): PersonObject => {
        if (id && id.split(":")[0] !== "3d5c8d20-3024-4537-8dca-64cd241b9a92")
            throw new Error(`CODE00000000 Person.getOrThrow Incorrect domainId in id = ${id}`);
        if (!id) {
            throw new Error(`CODE00000000 Person.getOrThrow id is empty!`);
        }
        const r = new KeyValueToMsgTranslator<unknown, PersonObject>({
            baseTypeMeta: objectRoot.odbConnection.odbBase.__metaRoot.expectType("Person"),
            stateReader: objectRoot.odbConnection,
            actionProcessor: objectRoot.stdActionProcessor,
            path: ["Person", id],
            createIfNotExists: true,
        });
        return r.asObj();
    },

    // Generated by 30000021
    getOrUndefined: (id: ObjectId | undefined): PersonObject | undefined => {
        if (!PersonDomain.defaultObjectRoot)
            throw new Error(
                `CODE00000000 Person.getOrUndefined You should first set defaultObjectRoot before using getOrUndefined or else use getOrUndefinedEx!`,
            );
        return PersonDomain.getOrUndefinedEx(PersonDomain.defaultObjectRoot, id);
    },

    getOrUndefinedEx: (objectRoot: ObjectRoot, id: ObjectId | undefined): PersonObject | undefined => {
        if (id && id.split(":")[0] !== "3d5c8d20-3024-4537-8dca-64cd241b9a92")
            throw new Error(`CODE00000000 Person.getOrUndefined Incorrect domainId in id = ${id}`);
        if (!id) {
            return undefined;
        }
        const r = new KeyValueToMsgTranslator<unknown, PersonObject>({
            baseTypeMeta: objectRoot.odbConnection.odbBase.__metaRoot.expectType("Person"),
            stateReader: objectRoot.odbConnection,
            actionProcessor: objectRoot.stdActionProcessor,
            path: ["Person", id],
            createIfNotExists: true,
        });
        return r.asObj();
    },

    // Generated by 30000025
    verifyPermissions: (objectRoot: ObjectRoot, object: PersonObject, domainAction: DomainActionSerialized): boolean => {
        return true;
    },

    // Generated by 30000050
    beforeSendAction: (
        objectRoot: ObjectRoot,
        object: PersonObject,
        domainAction: DomainActionSerialized,
        targetDataSide: DataSide,
        destSession: SessionObject | undefined,
    ): DomainActionSerialized | undefined => {
        let cloned: true | undefined;
        let change = domainAction;
        if (targetDataSide === dataSide_db) return undefined;

        //-------------------------------------------- Custom code start --------------------------------------------

        //-------------------------------------------- Custom code end --------------------------------------------

        return change;
    },
};
