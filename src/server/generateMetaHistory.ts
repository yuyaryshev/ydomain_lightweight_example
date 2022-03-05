export {};

/*
import debugjs from "debug";
import { HastyStore, storageOriginFromCode, tsType } from "@yuyaryshev/yTBDREMH2";
// @ts-ignore
import { generateMetaVersion, YdbDomain, YdbDomainField } from "YdbMigrator";
import { projectSubpath } from "../projectDir.js";

let debug = debugjs("api.generateMetaHistory");

const generateMetaHistory = async () => {
    for (let i = 0; i < 5; i++) console.error("CODE00000119 Remove @ts-ignore on 'domains' import");

    try {
        debug("C2001 - creating hastyStore");
        let hastyStore = new HastyStore("generate", {} as any);

        debug("C2002 - setting up meta (domains)");
        throw new Error(`Uncomment line below!`);
        //for (let dk in domains) await domains[dk].init();

        let versionHistoryFolder = projectSubpath("api_server/version_history");
        let compiledMetaFolder = projectSubpath("domains/compiledMeta");
        debug(`C2003 - generateMetaHistory to: ${versionHistoryFolder}`);

        const ydbMigratorDomains = Object.values(hastyStore.domainsByName)
            .filter((d: any) => d.storageOrigin <= storageOriginFromCode("db"))
            .map(
                (d) =>
                    ({
                        id: d.id,
                        name: d.name,
                        fields: Object.values(d.fields)
                            .filter((f) => f.stored)
                            .map(
                                (f) =>
                                    ({
                                        id: f.id,
                                        name: f.name,
                                        type: tsType(f.type),
                                        dbNativeType: f.dbNativeType,
                                        defaultValue: f.defaultValue,
                                        nullable: true,
                                    } as YdbDomainField),
                            ),
                    } as YdbDomain),
            );

        await generateMetaVersion(ydbMigratorDomains, versionHistoryFolder);

        debug("C2004 - generateMetaHistory completed");
    } catch (e) {
        console.error("Failed to generateMetaHistory.");
        console.error(e);
    }
};

generateMetaHistory();
*/