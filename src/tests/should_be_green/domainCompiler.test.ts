import { expect } from "chai";
import debugjs from "debug";
import { awaitDelay, expectThrow, isPromise } from "ystd";
import { TaskDomain as ServerTaskDomain, TaskObject as ServerTaskObject } from "../../server/domains_gen/index.js";
import { ClientMainDomain, domainRoot as clientDomainRoot, domainRoot, TaskObject as ClientTaskObject } from "../../client/domains_gen/index.js";
import { apiFunction, AuthToken, callApi } from "@yuyaryshev/ytransport_common";
import { setupEnvForOdbTest, TestEnv } from "../../setupEnvForOdbTest.js";
import { newOdbConnection, newOdbContRef, odbExecSerialized } from "@yuyaryshev/ydomain_common";
import { Observer, useObserverFunc } from "@yuyaryshev/ydomain_client";
import { example1Api } from "../../api/index.js";
import { TaskDomain } from "../../client/domains_gen/Task.js";

let debug = debugjs("api.startup");

// const oldIt = it;
// const newIt = async (name: string, callback: any) => {
//     const test = oldIt(name, callback);
//     while (test.isPending()) await awaitDelay(20);
// };
//
// // @ts-ignore
// it = newIt;

const ut_uuid = [
    ServerTaskDomain.id + ":" + "4cb6ea4c-6b3a-45a6-abfb-e67dfa3e6e13",
    ServerTaskDomain.id + ":" + "a78df690-cbad-4a22-af23-c4c44cdc255d",
    ServerTaskDomain.id + ":" + "d615eb7f-8011-40cd-bbff-428b1378a00f",
    ServerTaskDomain.id + ":" + "ab252a54-09b5-4819-860f-30e2deef465b",
];

process.on("unhandledRejection", (error, p) => {
    console.log("=== UNHANDLED REJECTION ===");
    // @ts-ignore
    console.dir(error.stack);
});

let sessionSequence: number = 1;
function utNewSessionIdGenerator() {
    if (sessionSequence >= 3) {
        console.log(`sessionSequence ${sessionSequence} >= 3`);
    }

    const r = `ut_session_${sessionSequence++}`;
    console.log(`Created ${r}`);
    return r;
}

describe("domainCompiler.test.ts", function () {
    let testEnv: TestEnv;
    it("setupEnvForOdbTest", async function () {
        testEnv = await setupEnvForOdbTest({ stage: "full" });
        console.log(`CODE00000028 setupEnvForOdbTest completed`);
    });

    it("set,get directly with odbExecSerialized", async function () {
        const odbWriteConnection = newOdbConnection(testEnv.serverOdb, undefined, "layer1", undefined, "odbWriteConnection", "CODE00000029");
        const odbReadConnection = newOdbConnection(testEnv.serverOdb, "layer2", undefined, undefined, "odbReadConnection", "CODE00000030");

        const testRef = newOdbContRef("Task", "1");
        const setResultObj = await odbExecSerialized(odbWriteConnection, { ref: testRef, a: "createContainer", typeId: "Task" });

        const setResult = await odbExecSerialized(odbWriteConnection, { ref: [...testRef, "name"], a: "set", v: "task1_v1" });

        const getResult = await odbReadConnection.itemGet(testRef, "name");
        expect(getResult).to.deep.equal({ t: "value", v: "task1_v1", k: "name" });
    });

    it("set & await get with RefTo*", async function () {
        const client1Main = await ClientMainDomain.getOrCreateEx(testEnv.client1ObjectRoot, "a73e24f0-c68b-47e4-bbcb-92585e04c653:singleton");
        await client1Main.a.set("value1");
        const v = await client1Main.a.get();
        expect(v).to.equal("value1");
    });

    it("set & get no wait with RefTo*", async function () {
        const client1Main = await ClientMainDomain.getOrCreateEx(testEnv.client1ObjectRoot, "a73e24f0-c68b-47e4-bbcb-92585e04c653:singleton");
        await client1Main.a.set("value2");

        const v0 = await client1Main.a.get();
        expect(v0).to.equal("value2");

        const v1 = client1Main.a.get();
        expect(isPromise(v1)).to.equal(false, "should not return Promise on second get!");

        const v2 = client1Main.a.get();
        expect(v2).to.equal("value2");
    });

    it("observer update with RefTo*", async function () {
        const client1Main = await ClientMainDomain.getOrCreateEx(testEnv.client1ObjectRoot, "a73e24f0-c68b-47e4-bbcb-92585e04c653:singleton");
        await client1Main.a.set("value3");

        let callsCount = 0;
        function testObserver() {
            client1Main.a.get();
            callsCount++;
        }
        useObserverFunc(testObserver);

        await client1Main.a.set("value4");

        expect(callsCount).to.equal(1);
    });

    // const serverRunContext = {
    //     f: false,
    //     error: undefined as Error | undefined,
    //     closed: undefined as boolean | undefined,
    // };

    // let serverEnv: ServerEnv = undefined as any;
    //
    // let client1RunContext: ClientEnv;
    // let client2RunContext: ClientEnv;
    // let client1Main: ClientMainObject;

    let obj: ServerTaskObject;
    let client1Obj: ClientTaskObject;
    let client2Obj: ClientTaskObject;

    let authToken: AuthToken;

    it("Auth - register", async function () {
        testEnv.serverTransportService.setUserPass("1", "1");
    });

    it("Does auto connection work?", async function () {
        await testEnv.client1TransportService.waitIfConnecting();
        expect(testEnv.client1TransportService.connected);
    });

    it("Session - connected", async function () {
        console.log(`CODE00000031 - UT Session - connecting`);
        await testEnv.client1TransportService.connect();
        expect(!!testEnv.client1TransportService.connected).equal(true);
        console.log(`CODE00000032 - UT Session - connected!`);
    });

    it("Auth - failed login", async function () {
        // expect(!!testEnv.client1TransportService.authed).equal(false);

        await expectThrow(async () => {
            await testEnv.client1TransportService.authWithPassEx({
                t: "AuthClient",
                login: "2",
                pass: "2",
            });
        });
        expect(!!testEnv.client1TransportService.authed).equal(false);
    });

    it("Auth - failed pass", async function () {
        expect(!!testEnv.client1TransportService.authed).equal(false);
        await expectThrow(async () => {
            await testEnv.client1TransportService.authWithPassEx({
                t: "AuthClient",
                login: "1",
                pass: "2",
            });
        });
        expect(!!testEnv.client1TransportService.authed).equal(false);
    });

    it("Auth with pass - success", async function () {
        expect(!!testEnv.client1TransportService.authed).equal(false);
        authToken = await testEnv.client1TransportService.authWithPassEx({
            t: "AuthClient",
            login: "1",
            pass: "1",
        });
        expect(!!testEnv.client1TransportService.authed).equal(true);
    });

    it("Auth with token - failed", async function () {
        expect(!!testEnv.client2TransportService.authed).equal(false);
        await expectThrow(async () => {
            await testEnv.client2TransportService.authWithTokenEx({
                t: "AuthByToken",
                token: "WRONG_KEY" + authToken.key,
            });
        });
        expect(!!testEnv.client2TransportService.authed).equal(false);
    });

    it("Auto auth with token - success", async function () {
        expect(!!testEnv.client2TransportService.authed).equal(false);

        // Обычно эта функция вызывается автоматом и асинхронно при инициализации, если не передан спец флаг запрещающий этот вызов
        // Тесты стартуют именно с таким флагом, поскольку требуется контролировать момент когда происходит автоматическая авторизация
        const CookiesMock = {
            get: (k: string) => {
                return k === "authData" ? JSON.stringify(authToken) : undefined;
            },
        };

        await testEnv.client2TransportService.autoAuthByToken(CookiesMock);
        expect(!!testEnv.client2TransportService.authed).equal(true);
    });

    it("Auth - server side authed", async function () {
        const sessions = testEnv.serverTransportService.sockets.values();
        const sessionsDump: any = {};

        for (let session of testEnv.serverTransportService.sockets.values()) {
            sessionsDump[session.sessionId] = { login: session.login, authed: !!session.authed };
            expect(sessionsDump[session.sessionId]).to.deep.equal({ authed: true, login: "1" });
        }
        expect(Object.keys(sessionsDump).length > 0).equal(true);
        // expect(sessionsDump["ut_session_3"]).to.deep.equal({ authed: true, login: "1" });
    });

    it("Auth - failed login when authed", async function () {
        expect(!!testEnv.client1TransportService.authed).equal(true);
        await expectThrow(async () => {
            await testEnv.client1TransportService.authWithPassEx({
                t: "AuthClient",
                login: "2",
                pass: "2",
            });
        });
        expect(!!testEnv.client1TransportService.authed).equal(false);
    });

    it("waiting for connections to settle...", async function () {
        for (let i = 0; i < 10; i++) {
            if (testEnv.serverTransportService.sockets.size >= 2) return;
            await awaitDelay(100);
        }
        throw new Error(`CODE00000035 Connection didn't settled in expected time`);
    });

    it("client1->server example1api", async function () {
        const response = await callApi(testEnv.client1TransportService, example1Api, {
            key: 777,
            callMe: false,
        });
        expect(response.r).to.deep.equal("SERVER Got request 777");
    });

    it("client1->server->client1 example1api", async function () {
        const response = await callApi(testEnv.client1TransportService, example1Api, {
            key: 888,
            callMe: true,
        });
        await awaitDelay(300);
        expect(response.r).to.deep.equal("SERVER Got request 888");
        expect(testEnv.clientReceivedDatas?.[889]?.key).to.deep.equal(889);
    });

    it("server init objects", async function () {
        TaskDomain.getOrCreateEx(testEnv.client1ObjectRoot, ut_uuid[0]);
        if (!testEnv.client1TransportService) throw new Error(`CODE00000036 objectRoot is undefined`);
        client1Obj = await TaskDomain.getOrCreateEx(testEnv.client1ObjectRoot, ut_uuid[0]);
        client2Obj = await TaskDomain.getOrCreateEx(testEnv.client2ObjectRoot, ut_uuid[0]);
        obj = await ServerTaskDomain.getOrCreateEx(testEnv.serverObjectRoot, ut_uuid[0]);
    });

    it("server sets scalar value", async function () {
        await obj.name.set("Task1");
        await obj.t.set("v1");
        expect(await obj.t.get()).to.equal("v1");
    });

    it("server -> client scalar (initial set)", async function () {
        // СУТЬ ПРОБЛЕМЫ
        // Сообщения ВООБЩЕ не заходят в серверный handle_changes
        // Соответственно вся последующая маршрутизация просто не может произойти

        // РЕШЕНИЕ
        // Нужно доделать то, что я стал делать с каналлами.
        // Сообщение не должно напрямую слаться в odbConnection или odbBase,
        // в начале оно должно засылаться в канал, а уже оттуда маршрутизироваться дальше

        // А как оно должно было туда попасть?
        // По идее сервер должен был отправить это изменение на клиент.
        // Это значит в момент обработки изменения
        // ydomain_server - поиск DEBUGGING_ydomain_server ГДЕ ЭТО КОНКРЕТНО?
        // Должно было пройти сообщение.
        // Затем через WebSocket должен был быть вызван API клиента
        // Который применит это изменение уже на клиенте
        // Нужно проверить получение этого вызова на клиенте
        // ydomain_client - ГДЕ ЭТО КОНКРЕТНО?
        await awaitDelay(100);
//        await obj.t.set("v1");

        expect(await client1Obj.t.get()).to.equal("v1");
    });

    it("server sets scalar value - v2", async function () {
        await obj.t.set("v212");
        expect(await obj.t.get()).to.equal("v212");
    });

    it("server -> client scalar - v2", async function () {
        await awaitDelay(100);
        expect(await client1Obj.t.get()).to.equal("v212");
    });
    //
    /*
    it("yTBDREMH2_tests - server -> db scalar (initial put)", async function () {
        await testEnv.serverLevelup.put('k1_dbg','v1_dbg');
        await testEnv.serverLevelup.put('k2_dbg','v2_dbg');
        await testEnv.serverLevelup.put('k3_dbg','v3_dbg');
        /////
        console.log('SCANNING testEnv.serverLevelup')
        for await (const [key, value] of testEnv.serverLevelup.iterator()) {
            console.log([key, value]);
        }
        console.log('SCANNING testEnv.serverLevelup - DONE!')
        /////
        console.log('SCANNING testEnv.serverLevelup - 2')
        testEnv.serverLevelup.createReadStream()
            .on('data', function (data) {
                console.log(data.key, '=', data.value)
            })
            .on('error', function (err) {
                console.log('Oh my!', err)
            })
            .on('close', function () {
                console.log('Stream closed')
            })
            .on('end', function () {
                console.log('Stream ended')
            })
        console.log('SCANNING testEnv.serverLevelup - 2 DONE!')
        /////
        const kvObjects = serverEnv.sqliteKV!.get(ut_uuid[0]);
        expect(kvObjects.length).to.equal(1);
        expect(kvObjects[0].fields.t.n).to.equal("v1");
    });
    return;

    it("yTBDREMH2_tests - server -> db set (initial put)", async function () {
        const kvObjects = serverEnv.sqliteKV!.get(ut_uuid[0]);
        expect(kvObjects.length).to.equal(1);
        expect(kvObjects[0].fields.children).to.deep.equal({ c: true, p: [ut_uuid[0]] });
    });

    it("yTBDREMH2_tests - server -> * (initial put)", async function () {
        expect(obj.t.get()).to.equal("v1");
        expect(client1Obj.t.get()).to.equal("v1");
        expect(client2Obj.t.get()).to.equal("v1");
        expect([...client1Obj.children$().get()][0]?.id).to.equal(ut_uuid[0]);
        expect([...client2Obj.children$().get()][0]?.id).to.equal(ut_uuid[0]);
    });

    // it("yTBDREMH2_tests - server set list value", async function () {
    //     await obj.children$().put(obj.id);
    //     expect([...obj.children$().get()].map((o) => o?.id)).to.deep.equal([ut_uuid[0]]);
    // });
    //
    // it("yTBDREMH2_tests - server -> client set (initial set)", async function () {
    //     await awaitDelay(500);
    //     for (let i = 0; i < 10; i++) {
    //         if ([...obj.children$().get()][0] === obj) break;
    //         await awaitDelay(100);
    //     }
    //     expect([...obj.children$().get()][0]?.id).to.equal(ut_uuid[0]);
    // });
    //
    // it("yTBDREMH2_tests - server -> * (initial put)", async function () {
    //     expect([...client1Obj.children$().get()][0]?.id).to.equal(ut_uuid[0]);
    //     expect([...client2Obj.children$().get()][0]?.id).to.equal(ut_uuid[0]);
    // });

    it("yTBDREMH2_tests - client1 set value", async function () {
        await client1Obj.t.put("v2");
        expect(client1Obj.t.get()).to.equal("v2");
    });

    it("yTBDREMH2_tests - client1 -> server", async function () {
        for (let i = 0; i < 10; i++) {
            if (obj.t.get() === "v2") break;
            await awaitDelay(100);
        }
        expect(obj.t.get()).to.equal("v2");
    });

    it("yTBDREMH2_tests - client1 -> server -> db change", async function () {
        const kvObjects2 = serverEnv.sqliteKV!.get(ut_uuid[0]);
        expect(kvObjects2.length).to.equal(1);
        expect(kvObjects2[0].fields.t.n).to.equal("v2");
    });

    it("yTBDREMH2_tests - client1 -> server -> client2 change", async function () {
        expect(client2Obj.t.get()).to.equal("v2");
        expect(client1Obj.t.get()).to.equal("v2");
    });

    it("yTBDREMH2_tests - closing connection", async function () {
        serverRunContext.f = true;
        for (let i = 0; i < 100; i++) {
            if (serverRunContext.closed) break;
            await awaitDelay(10);
        }
        expect(serverRunContext.closed).to.equal(true);
    });

    it("yTBDREMH2_tests - createByKey", async function () {
        const obj2 = TaskDomain.getOrCreateBykeyEx(serverEnv.objectRoot, "byKey1");
        expect(obj2.n$().get()).to.equal("byKey1");
        const obj3 = TaskDomain.getOrCreateBykeyEx(serverEnv.objectRoot, "byKey1");
        expect(obj3.n$().get()).to.equal("byKey1");
        expect(obj3.id).to.equal(obj2.id);
    });

    xit("yTBDREMH2_tests - server ->  client shouldSendToClient", async function () {
        //await obj.n$().put(100);

        // TODO Сделать изменение на сервере, которое shouldSendToClient только к одному клиенту
        //      - Убедиться что пришло на один клиент
        //      - Убедиться что не пришло на второй клиент
        expect("").to.equal("TBD");
    });

    xit("yTBDREMH2_tests - know if change is actually saved", async function () {
        // TODO я не умею проверять что значение сохранилось - поэтому я и использую эти странные циклы с awaitDelay.
        // А такая проверка мне может потребоваться!!!
    });

    it("continue with ListUi tests", async function () {
        expect("").equal("Uncomment react test above");
    });

    it("continue with ListUi tests", async function () {
        expect("").equal("Uncomment children$ tests above");
    });

    it("continue with ListUi tests", async function () {
        expect("").equal("Uncomment following tests");
    });
    /************/
});
