// Этот файл нужно переделать после того как тесты станут зелеными, забрав инициализацию из тестов.
import { addPlugin, newPublisher, YtransportClient } from "@yuyaryshev/ytransport_client";
import { YtransportObservablePlugin } from "@yuyaryshev/ytransport_observable";
import { YtransportCallbackPlugin } from "@yuyaryshev/ytransport_callback";
import debugjs from "debug";
import { makeYtransportClientWithOdb, OdbLayerSchemeInput, newOdbConnection, getCurrentObserver } from "@yuyaryshev/ydomain_client";
import {
    ClientMainDomain, ClientMainObject, domainRoot, clientDomainsMetaInput,
} from "./domains_gen/index.js";
import { ApiWithSession, implementApi, sessionRequester, YtransportService_publish } from "@yuyaryshev/ytransport_common";
import { DbgPageEngine } from "@yuyaryshev/dbg_page_engine";
import { ObjectRoot, OdbBase, OdbConnection } from "@yuyaryshev/ydomain_common";
import { YtransportClientWithAuth } from "@yuyaryshev/ytransport_client_with_auth";
import { EnvWithTimers } from "ystd";
import { ManageableTimer } from "ystd/src/manageableTimer";
import { example1Api } from "../api/index.js";
import {newTestOdbBase} from "../setupEnvForOdbTest.js";
import {MetaRoot} from "@yuyaryshev/ydomain_meta";
const debugTestsApi = debugjs("tests.api");

let debug = debugjs("client.startup");

export interface SetupSettings {
    port: number;
}

export interface ClientEnv extends EnvWithTimers {
    clientTransportService: YtransportClientWithAuth;
    clientMain: ClientMainObject;
    clientOdb: OdbBase;

    // All the following are just alias for YtransportClientWithOdb
    transportService: YtransportClientWithAuth;
    session: YtransportClientWithAuth; //SessionBase;
    authClient: YtransportClientWithAuth; //YtransportClientWithAuth;
    TBDREMH2Client: YtransportClientWithAuth; //any;
    objectRoot: ObjectRoot;
    clientReceivedDatas: any;
}

export const makeClientEnv = async (port: number): Promise<ClientEnv> => {
    debug(`CODE00000272 - ClientEnv startup entered 'setup', port '${port}'`);
    let clientEnv: ClientEnv = {
        timers: new Set(),
    } as any as ClientEnv;


    debug(`CODE00000125 - initializing MetaRoot`);
    const clientMetaRoot = new MetaRoot(clientDomainsMetaInput);

    debug(`CODE00000026 - initializing Odb`);
    clientEnv.clientOdb = await newTestOdbBase({cpl:"CODE00000120", name:"CLNT", persistent: false, appRootMeta:"ClientMain", metaRoot: clientMetaRoot});

    debug(`CODE00000033 - initializing Ytransport`);
    const getRuntimeSubscribers = () => {
        return [getCurrentObserver()];
    };

    const clientObjectRoot = makeYtransportClientWithOdb({
        env: clientEnv,
        odbConnection: newOdbConnection(clientEnv.clientOdb, "layer2", "layer1"),
        domainRoot: domainRoot,
        cpl: "CODE00000211",
        name: "yhasty2_tests_ui.client",
        host: "localhost",
        port,
    });
    clientEnv.objectRoot = clientObjectRoot;
    clientObjectRoot.odbConnection.odbBase.runtimeSubscriberGetters.add(getRuntimeSubscribers);
    clientEnv.clientTransportService = clientObjectRoot.baseYtransport;

    addPlugin<YtransportClient>(clientObjectRoot.baseYtransport, new YtransportCallbackPlugin());
    addPlugin<YtransportClient>(clientObjectRoot.baseYtransport, new YtransportObservablePlugin());
    //addPlugin(clientEnv.clientObjectRoot, new YtransportHastyPlugin(clientEnv.clientHastyStore));

    debug(`CODE00000034 - connecting to server`);
    clientObjectRoot.baseYtransport.connect();

    const clientSession = clientEnv.clientTransportService;
    const clientPublish = newPublisher(clientEnv.clientTransportService);

    // define simple API
    clientEnv.clientReceivedDatas = {};

    implementApi(clientEnv.clientTransportService, example1Api, (data: typeof example1Api.request & ApiWithSession): typeof example1Api.response => {
        if (data.key) clientEnv.clientReceivedDatas[data.key] = data;
        const r = `CLIENT Got request ${data.key || ""}`;
        const m = `CODE00000122 ${r} from sessionId=${data.session.sessionId}`;
        debugTestsApi(m);
        return { r, m };
    });


    debug("CODE00000023 - Checking client state!");

    // expect(1).not.equal(2);

    debug("CODE00000024 - Starting clientMain!");
    const clientMain = ClientMainDomain.getOrCreateEx(clientObjectRoot, undefined);

    debug("CODE00000025 - ClientEnv startup finished successfully!");
    return clientEnv;
};

let private_clientEnv: ClientEnv | undefined = undefined;
(async () => {
    private_clientEnv = await makeClientEnv(3331);
})().finally();
export const clientEnv = (): ClientEnv => {
    return private_clientEnv!;
};
// clientEnvInitTests(clientEnv, window);
