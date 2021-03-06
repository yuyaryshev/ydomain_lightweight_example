// Generated by 00000145

// COPY PASTE BELOW! FIX IT FOR LIGHTWEIGHT!

import {
    Domain,
    DomainActionSerialized,
    ObjectRoot,
    DomainObject,
    DomainRoot,
    Ysocket,
    DataDirection,
    OdbTypeId,
    OdbBase,
} from "@yuyaryshev/ydomain_client";
import { AuthEvent } from "@yuyaryshev/ytransport_client_with_auth";

import { ObjectId } from "ystd";
// Generated by 30000042
import { ClientMainDomain, ClientMainObject } from "./ClientMain.js";
// Generated by 30000042
import { SessionDomain, SessionObject } from "./Session.js";
// Generated by 30000042
import { PersonDomain, PersonObject } from "./Person.js";
// Generated by 30000042
import { ServerMainDomain, ServerMainObject } from "./ServerMain.js";
// Generated by 30000042
import { TaskDomain, TaskObject } from "./Task.js";
// Generated by 30000042
import { UserDomain, UserObject } from "./User.js";
// Generated by 30000042
import { WorkspaceDomain, WorkspaceObject } from "./Workspace.js";

export * from "./ClientMain.js";
export * from "./Session.js";
export * from "./Person.js";
export * from "./ServerMain.js";
export * from "./Task.js";
export * from "./User.js";
export * from "./Workspace.js";

// Generated by 00000146
export * from "./runtimeMeta.js";

// Generated by 00000147
export const domains = {
    ClientMain: ClientMainDomain,
    Session: SessionDomain,
    Person: PersonDomain,
    ServerMain: ServerMainDomain,
    Task: TaskDomain,
    User: UserDomain,
    Workspace: WorkspaceDomain,
};

// Generated by 00000148
export const domainsArray = [ClientMainDomain, SessionDomain, PersonDomain, ServerMainDomain, TaskDomain, UserDomain, WorkspaceDomain];

// Generated by 00000149
export const domainsById = new Map([
    [ClientMainDomain.id, ClientMainDomain as Domain<any>],
    [SessionDomain.id, SessionDomain as Domain<any>],
    [PersonDomain.id, PersonDomain as Domain<any>],
    [ServerMainDomain.id, ServerMainDomain as Domain<any>],
    [TaskDomain.id, TaskDomain as Domain<any>],
    [UserDomain.id, UserDomain as Domain<any>],
    [WorkspaceDomain.id, WorkspaceDomain as Domain<any>],
]);

// Generated by 00000150
export const expectDomainByDomainId = (domainId: OdbTypeId) => {
    // const domainId = id.split(":")[0];
    const domain = domainsById.get(domainId);
    if (!domain) throw new Error(`CODE00000000 Unknown domainId=${domainId}`);
    return domain;
};

// Generated by 00000151
export const expectDomainByObjectId = (objectId: string) => {
    const domainId = objectId.split(":")[0];
    const domain = domainsById.get(domainId);
    if (!domain) throw new Error(`CODE00000000 Unknown domainId in objectId=${objectId}`);
    return domain;
};

// Generated by 00000152
let warned_findDomainByName = false;
export const findDomainByName = (name: string): Domain<any> | undefined => {
    if (!warned_findDomainByName) {
        warned_findDomainByName = true;
        console.warn(
            `CODE00000000 expectDomainByName/findDomainByName should only be used for debug! In all runtime cases domains should be searcehed by Id insted! Needs refactoring!`,
        );
    }
    return (domains as any)[name];
};

// Generated by 00000153
export const expectDomainByName = (name: string): Domain<any> => {
    const r = findDomainByName(name);
    if (!r) {
        throw new Error(`CODE00000000 Unknown domainName=${name}!`);
    }
    return r;
};

// Generated by 00000154
// export const applyChange = (objectRoot: ObjectRoot, change: DomainActionSerialized, dataDirection: DataDirection, senderSession: Ysocket | undefined): DomainObject => {
//     const domainId = rootTypeIdFromOdbPath(change.ref);
//     return expectDomainByDomainId(domainId).applyChange(objectRoot, change, dataDirection, senderSession);
// };

// Generated by 00000155
export const getOrCreateEx = (objectRoot: ObjectRoot, id: ObjectId): DomainObject => {
    return expectDomainByObjectId(id).getOrCreateEx(objectRoot, id);
};

// Generated by 00000157

// Generated by 00000158
export const domainRoot: DomainRoot = {
    dataSide: 4, // client
    expectDomainByDomainId,
    findDomainByName,
    expectDomainByName,
    //        applyChange,
    getOrCreateEx,
};

// Generated by 00000159
export const makeOnAuthEventHandler = (objectRoot: ObjectRoot) => {
    return async function onAuthEventHandler(e: AuthEvent) {
        // TODO DELETE THIS - NOT USED ANYMORE!
        // const session = e.session as any as SessionObject;
        // if (!objectRoot) throw new Error(`CODE00000000 Error couldn't get objectRoot from service!`);
        //
        // switch (e.type) {
        //     case "auth": {
        //         const user = objectRoot.getOrCreateEx(e.login) as UserObject;
        //         let workspace = user.workspace;
        //         if (!workspace) {
        //             workspace = WorkspaceDomain.getOrCreateEx(objectRoot, undefined);
        //             user.workspace$().set(workspace);
        //         }
        //
        //         const objects: DomainObject<any>[] = (domainRoot.allClientObjects ? domainRoot.allClientObjects(objectRoot, session) : []);
        //         for (let object of objects) objectRoot.addDownstreamChange(object, object.toChange(), session);
        //
        //         session.login$().set(e.login);
        //         workspace.send(session);
        //         return;
        //     }
        //     case "exit": {
        //         // TODO onAuthEvent.exit ?????????????????? unload ???? ???????? ?????????????????????? ????????????????
        //         const user = objectRoot.getOrCreateEx(e.login) as UserObject;
        //         const workspace = WorkspaceDomain.getOrCreateEx(objectRoot, undefined);
        //         user.workspace$().set(workspace);
        //
        //         session.login$().set(undefined);
        //         workspace.send(session);
        //         return;
        //     }
        // }
    };
};

// Generated by 00000160
export function setDefaultObjectRoot(defaultObjectRoot: ObjectRoot | undefined) {
    for (let domainKey in domains as any) (domains as any)[domainKey].defaultObjectRoot = defaultObjectRoot;
}
