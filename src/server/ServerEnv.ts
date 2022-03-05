// Этот файл нужно переделать после того как тесты станут зелеными, забрав инициализацию из тестов.
import { addPlugin, newPublisher } from "@yuyaryshev/ytransport_server";
import debugjs from "debug";
import { YtransportObservablePlugin } from "@yuyaryshev/ytransport_observable";
import { YtransportCallbackPlugin } from "@yuyaryshev/ytransport_callback";
import { AbstractLevelDOWN } from "abstract-leveldown";
import { makeDevAuthStorage, YtransportServerWithAuth } from "@yuyaryshev/ytransport_server_with_auth";
import { makeYtransportServerWithOdb } from "@yuyaryshev/ydomain_server";
import { newOdbConnection, ObjectRoot, OdbBase } from "@yuyaryshev/ydomain_common";
import { domainRoot, serverDomainsMetaInput } from "./domains_gen/index.js";
import { EnvWithTimers } from "ystd";
import { writeFileSyncIfChanged } from "ystd_server";
import { projectDir, projectSubpath } from "../projectDir.js";
import { resolve } from "path";
import { readFileSync } from "fs-extra";
import { parse } from "json5";
import { DbgPageEngine } from "@yuyaryshev/dbg_page_engine";
import { clientDomainsMetaInput, } from "../client/domains_gen/index.js";
import { ApiWithSession, callApi, implementApi } from "@yuyaryshev/ytransport_common";
import { example1Api } from "../api/index.js";
import { MetaRoot } from "@yuyaryshev/ydomain_meta";
import {newTestOdbBase} from "../setupEnvForOdbTest.js";
const debugTestsApi = debugjs("tests.api");

export interface ServerEnv extends EnvWithTimers {
    serverOdb: OdbBase;
    serverTransportService: YtransportServerWithAuth;
    rawStorageDriver: AbstractLevelDOWN<any, any>;
    objectRoot: ObjectRoot;
    serverReceivedDatas: any;
}
let debug = debugjs("server.startup");

export interface SetupSettings {
    port: number;
    disableSelfTest?: boolean;
    devData?: boolean;
    sqlDebug?: boolean;
    disableAllSecurityChecks?: boolean;

    srcPath: string;
}

export interface RunContext {
    f?: boolean;
    closed?: boolean;
    error?: Error;
}

export const startServer = async (runContext: RunContext = {}) => {
    let serverEnv: ServerEnv = {
        timers: new Set(),
    } as any as ServerEnv;
    try {
        let settingsPath = resolve(projectDir, process.env.SETTINGS_FILE || "settings.json"); // Уметь заменять имя settings файла или clause в нем через ENV параметры и параметры коммандной строки

        debug(`CODE00000121 - reading settings from ${settingsPath}`);
        const settings: any = parse(readFileSync(settingsPath, "utf-8"));
        const port = settings?.port || 3331;

        debug("CODE00000123 - writing server_settings.ts");
        let settingsInClientFolderPath = projectSubpath("src", "client", "server_settings.ts"); // resolve(join(process.cwd(), '../../../settings.json'));
        writeFileSyncIfChanged(settingsInClientFolderPath, "export const server_settings = " + JSON.stringify({ port }) + ";\n");
        //
        // let storageExists = existsSync(settings.storageFileName);
        // if (settings.devData && storageExists) {
        //     debug(`CODE00000124 - Deleting StorageFile at '${settings.storageFileName}' because settings.devData=true ...`);
        //     removeSync(settings.storageFileName);
        //     storageExists = false;
        // }
        //     let storageFileName = settings.storageFileName;

        debug("CODE00000126 - creating odb");

        const serverMetaRoot = new MetaRoot(serverDomainsMetaInput);
        serverEnv.serverOdb = await newTestOdbBase({
            cpl: "CODE00000156",
            name: "SRVR",
            persistent: true,
            pageSizeMode: "big",
            appRootMeta: "ServerMain",
            metaRoot: serverMetaRoot,
        });
        // serverEnv.serverMemdown = (serverEnv.serverOdb as any).memdown;
        // serverEnv.serverLevelup = levelup(serverEnv.serverMemdown);

        debug("CODE00000127 - creating transportService");
        // Server
        const sqliteKV = await makeDevAuthStorage();
        const { authDb, authDbPool, authStorage } = sqliteKV;
        const serverObjectRoot = makeYtransportServerWithOdb({
            env: serverEnv,
            odbConnection: newOdbConnection(serverEnv.serverOdb, "layer1", "layer1"),
            cpl: "CODE00000128",
            name: "!setup.ts - server",
            port,
            domainRoot: domainRoot,
            authStorage,
        });
        serverEnv.objectRoot = serverObjectRoot;
        serverEnv.serverTransportService = serverObjectRoot.baseYtransport;
        addPlugin(serverObjectRoot.baseYtransport, new YtransportCallbackPlugin());
        addPlugin(serverObjectRoot.baseYtransport, new YtransportObservablePlugin());
        //addPlugin(serverEnv.transportService, new YtransportHastyPlugin(serverEnv.hastyStore));

        debug("CODE00000129 - publishing apis");

        // define simple API
        serverEnv.serverReceivedDatas = {};
        let receivedData = undefined;

        implementApi(
            serverEnv.serverTransportService,
            example1Api,
            async (data: typeof example1Api.request & ApiWithSession): Promise<typeof example1Api.response> => {
                if (data.key) serverEnv.serverReceivedDatas[data.key] = data;
                const r = `SERVER Got request ${data.key || ""}`;
                const m = `CODE00000157 ${r} from sessionId=${data.session.sessionId}`;
                debugTestsApi(m);
                if (data.callMe) {
                    await callApi(data.session, example1Api, { key: data.key + 1, callMe: false });
                }
                return { r, m };
            },
        );

        debug("CODE00000130 - starting listener");
        serverEnv.serverTransportService.listen();
        console.log(`Api Server is listening on port ${port}!`);

        // APP SERVER SHOULD KEEP THIS
        // if (!settings.disableSelfTest) {
        //     debug("CODE00000131 - starting testBeforeListen");
        //     await testBeforeListen(serverEnv);
        //     debug("CODE00000132 - finished testBeforeListen");
        // }

        if (runContext) {
            function watchTerminationFlag() {
                if (runContext.f!) {
                    console.log(`CODE00000133 Stopping server!`);
                    runContext.closed = true;
                    serverEnv.serverTransportService.close(); // GRP_stopListen
                    console.log(`CODE00000134 Server stopped!`);
                } else setTimeout(watchTerminationFlag, 100);
            }
            watchTerminationFlag();
        }

        // APP SERVER SHOULD KEEP THIS
        // if (!settings.disableSelfTest) {
        //     debug("CODE00000135 - starting testAfterListen");
        //     await testAfterListen(serverEnv);
        //     debug("CODE00000136 - finished testAfterListen");
        // }

        // debug("CODE00000137 - initializing ApiServer");
        // serverEnv.apiServer = new IdeApiServer({
        //     srcPath:settings.srcPath,
        //     transport: serverEnv.transportService,
        //     publisherFunction:newPublisher(serverEnv.transportService),
        //
        // });

        debug("CODE00000138 - startup completed");
        return serverEnv;
    } catch (e: any) {
        runContext.error = e;
        console.error("Failed to start API server.");
        console.error(e);
        return undefined;
    }
};
