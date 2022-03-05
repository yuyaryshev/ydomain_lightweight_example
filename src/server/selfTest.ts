import { ServerEnv } from "./ServerEnv.js";
import { expect } from "chai";

// uuid && uuid && uuid
// 1b9ea930-d295-4136-97b8-bfcf091dca5b
// e0dc52b3-7cd6-4e16-979d-506fb358c500

export const testDomainId1 = "1b9ea930-d295-4136-97b8-bfcf091dca5b";
export const testDomainId2 = "e0dc52b3-7cd6-4e16-979d-506fb358c500";

export const cleanupTest = async (serverEnv: ServerEnv) => {
    await serverEnv.rawStorageDriver.sql92_query(`delete from object where type ='TestDomain'`);
    await serverEnv.rawStorageDriver.sql92_query("delete from TestDomain where 1=1");

    expect(await serverEnv.rawStorageDriver.sql92_query("select * from object")).to.deep.equal([]);
    expect(await serverEnv.rawStorageDriver.sql92_query("select * from TestDomain")).to.deep.equal([]);
};

export const testObjectSave = async (serverEnv: ServerEnv) => {
    // let newTask = serverEnv.hastyStore.createProxified(domains.TestDomain, testDomainId1);
    // newTask.name = "test1 0";
    // await newTask.save();
    //
    // expect(await newTask.name()).equal("test1 0");
    // let dbobj = await serverEnv.serviceDbPool.objectGet(testDomainId1);
    // expect(await serverEnv.serviceDbPool.objectGet(testDomainId1)).to.deep.equal({
    //     id: testDomainId1,
    //     type: "TestDomain",
    //     name: "test1 0"
    // });
    //
    // newTask.name = "test1 1";
    // await newTask.save();
    // expect(await newTask.name()).equal("test1 1");
    // expect(await serverEnv.serviceDbPool.objectGet(testDomainId1)).to.deep.equal({
    //     id: testDomainId1,
    //     type: "TestDomain",
    //     name: "test1 1"
    // });
    //
    // newTask = await domains.TestDomain.all.actions.create.func(testDomainId2);
    // newTask.name = "test2";
    // expect(await newTask.id).equal(testDomainId2);
    // expect(await newTask.name()).equal("test2");
    // await newTask.save();
};

export const testListObjectDirectQuery = async (serverEnv: ServerEnv) => {
    // let allTestDomains = await domains.TestDomain.all.query([]);
    // let plainData = make_plain_ex(allTestDomains)
    //     .map((a: any) => a.$target.name)
    //     .sort();
    // expect(plainData).to.deep.equal(["test1 1", "test2"]);
};

export const testListObjectListUi = async (serverEnv: ServerEnv) => {
    // let allTestDomainsListUi = new ListUi({
    //     listController: domains.TestDomain.all
    // });
    // await allTestDomainsListUi.awaitFullyLoaded();
    //
    // let data2 = allTestDomainsListUi.getData();
    // let plainData = make_plain_ex(data2)
    //     .map((a: any) => a.$target.name)
    //     .sort();
    // expect(plainData).to.deep.equal(["test1 1", "test2"]);
    //
    // allTestDomainsListUi.close();
};

export const testBeforeListen = async (serverEnv: ServerEnv) => {
    try {
        if (false) {
            // Disabled HastyStore
            await cleanupTest(serverEnv);
            await testObjectSave(serverEnv);
            await testListObjectDirectQuery(serverEnv);
            await testListObjectListUi(serverEnv);
        }
    } catch (e) {
        console.error("testBeforeListen failed");
        console.error(e);
        process.exit(1);
    }
    return true;
};

export const testAfterListen = async (serverEnv: ServerEnv) => {
    try {
        // let newTask = domains.task.create();
        // newTask.name = 'task1';
        // await newTask.save();
    } catch (e) {
        console.error("testAfterListen failed");
        console.error(e);
        process.exit(1);
    }
    return true;
};
