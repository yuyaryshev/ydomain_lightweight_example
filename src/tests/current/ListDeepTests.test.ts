// TODO_CURRENT DeepTest процессов работы со списками вцелом

import { expect } from "chai";
import { Domain, ListUi,   } from "@yuyaryshev/ydomain_common";
// import { ProxifiedObject, DomainListController,  make_plain_ex,  proxifyObject } from "@yuyaryshev/ydomain_common";
/*
import { setupHasty2Test, TestEnv } from "../../setupHasty2Test.js";

class UtListController extends DomainListController<any> {
    constructor(domain: Domain<any>) {
        super("UtListController", domain);
    }
}

const setup = async () => {
    let t = await setupHasty2Test({ objects: "big" });

    t.list1 = new UtListController(t.domain);
    t.list1Ui = new ListUi({
        listController: t.list1,
        itemSize: 30,
        viewSizePx: 300,
    });
    return t;
};

const waitForLoad = async (t: TestEnv) => {
    return t.list1Ui.awaitFullyLoaded();
};

const preload = async (t: TestEnv) => {
    await t.domain.queryAll.upsertSortedData([]);
    expect(t.list1Ui.dbgSync()).to.deep.equal([
        {
            interval: {
                a: { v: -Infinity, bias: 1 },
                b: { v: Infinity, bias: -1 },
            },
            state: "notloaded",
        },
    ]);

    let data = t.list1Ui.getData();
    expect(plainExData(data)).deep.equal([]);

    expect(t.list1Ui.getStartingLoader()).equal(true);
    expect(t.list1Ui.getEndingLoader()).equal(true);

    await waitForLoad(t);

    let data2 = t.list1Ui.getData();
    if (t.list1Ui.dbgSync().length < 100) debugger;
    expect(t.list1Ui.dbgSync().length).to.equal(100);
    expect(plainExData(data2)).deep.equal(t.tasksEtalon(0, 10, true));
};

const plainExData = (data: ProxifiedObject[] | undefined) => {
    return make_plain_ex(data);
};

xdescribe("ListDeepTests.test.ts", () => {
    it("create/destroy object", async function () {
        // this.timeout(1000 * 5);
        let t = await setup();

        await preload(t);
        t.list1Ui.setViewSizePx(10000);

        let data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(0, 1000, true));

        let notified = false;
        t.list1Ui.subscribe(() => {
            notified = true;
        });

        expect(notified).equal(false);
        let newObj = proxifyObject(t.hastyStore.create(t.domain, "tnew"));
        newObj.name = "newObj";
        newObj.n = -1;

        expect(notified).equal(true);

        let data3 = t.list1Ui.getData();
        expect(plainExData(data3)).deep.equal([
            ...t.tasksEtalon(0, 1000, true),
            {
                "!": "Proxy",
                $target: {
                    "!": "HastyData.Persistent",
                    id: "tnew",
                    n: -1,
                    name: "newObj",
                    type: "task",
                },
            },
        ]);

        notified = false;
        t.list1Ui.subscribe(() => {
            notified = true;
        });

        expect(notified).equal(false);
        newObj.destroy();
        expect(notified).equal(true);

        let data4 = t.list1Ui.getData();
        expect(plainExData(data4)).deep.equal(t.tasksEtalon(0, 1000, true));
    });

    it("create/destroy object with ListController", async function () {
        // this.timeout(1000 * 5);
        let t = await setup();

        await preload(t);
        t.list1Ui.setViewSizePx(10000);

        let data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(0, 1000, true));

        let notified = false;
        t.list1Ui.subscribe(() => {
            notified = true;
        });

        expect(notified).equal(false);

        let newObj = await t.list1.actions.create.func("tnew");
        newObj.name = "newObj";
        newObj.n = -1;

        expect(notified).equal(true);

        let data3 = t.list1Ui.getData();
        expect(plainExData(data3)).deep.equal([
            ...t.tasksEtalon(0, 1000, true),
            {
                "!": "Proxy",
                $target: {
                    "!": "HastyData.Persistent",
                    id: "tnew",
                    n: -1,
                    name: "newObj",
                    type: "task",
                },
            },
        ]);

        notified = false;
        t.list1Ui.subscribe(() => {
            notified = true;
        });

        expect(notified).equal(false);

        t.list1.actions.destroy.func(newObj);

        expect(notified).equal(true);

        let data4 = t.list1Ui.getData();
        expect(plainExData(data4)).deep.equal(t.tasksEtalon(0, 1000, true));
    });

    it("quickFilters complex", async () => {
        let t = await setup();

        await preload(t);

        let etalon: any = [];
        for (let x of t.tasks) if ((x.name.includes("ask0") || x.name.includes("ask1")) && x.name !== "task05") etalon.push(x);

        (t.list1Ui as any).dbgId = "YYA1";
        t.list1Ui.setViewSizePx(1000);
        t.list1Ui.setQuickFilters([
            {
                field: "name",
                include: [
                    { mode: "has", a: "ask0" },
                    { mode: "has", a: "ask1" },
                ],
                exclude: [{ mode: "=", a: "task05" }],
            },
        ]);
        let data0 = t.list1Ui.getData();

        await waitForLoad(t);
        let data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.etalonForProxied(etalon));
    });

    it("scrollTopPx, viewSizePx (from preloaded)", async () => {
        let t = await setup();

        await preload(t);

        let data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(0, 10, true));

        t.list1Ui.setScrollTopPx(165);

        await waitForLoad(t);

        expect(t.list1Ui.dbgSync().length).to.equal(100);

        data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(5, 10, true));

        t.list1Ui.setViewSizePx(150);

        await waitForLoad(t);
        expect(t.list1Ui.dbgSync().length).to.equal(100);

        data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(5, 5, true));

        t.list1Ui.setScrollTopPx(65);

        await waitForLoad(t);
        expect(t.list1Ui.dbgSync().length).to.equal(100);

        data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(2, 5, true));
    });

    it("condition n=50", async () => {
        let t = await setup();
        await preload(t);

        t.list1Ui.setCondition("n = 50");

        let data = t.list1Ui.getData();

        await waitForLoad(t);

        let data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(50, 1, true));
    });

    it("sort (from preloaded)", async function () {
        let t = await setup();
        await preload(t);

        t.list1Ui.setSort([{ field: "n", desc: true }]);
        t.tasks.sort((a: any, b: any) => (a.id <= b.id ? 1 : -1));

        t.list1Ui.getData();
        await waitForLoad(t);

        let data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.etalonForProxied(t.tasks.splice(0, 10)));
    });

    xit("useRecommendedQuery (from preloaded)", async () => {
        let t = await setup();

        await t.domain.queryAll.upsertSortedData([]);

        throw new Error("fix this ut.... no more queryRestricted");

        // t.domain.queryRestricted = undefined as any; // makeXQuery(t.domain.queryAll, "n >= 25");
        t.list1.recommendedQuery = undefined as any; // makeXQuery(t.domain.queryRestricted, "n >= 50");
        let etalon1: any[] = [];
        let etalon2: any[] = [];

        t.list1Ui.setUseRecommendedQuery(false);
        t.list1Ui.setUseRecommendedQuery(true);

        t.tasks.map((it: any) => {
            if (it.n >= 25) etalon1.push(it);
            if (it.n >= 50) etalon2.push(it);
        });

        expect(t.list1Ui.dbgSync()).to.deep.equal(etalon2);

        t.list1Ui.setUseRecommendedQuery(false);
        expect(t.list1Ui.dbgSync()).to.deep.equal(t.tasks);
    });

    xit("action create", async () => {
        let cache;
        // TODO_CURRENT React компонент запрашивает данные у ListUi
        // Как построить сквозной тест:
        //     - Данные есть в БД
        //     - На БД уходит запрос с фильтрами
        //     - Данные доходят до компонента
        //     - React компонент осуществляет action
        //     - добалвяет элемент
        //     - React компонент получает обновление от своих действий
        expect("Ok if not thrown").to.equal("Ok if not thrown TODO");
    });

    xit("action remove", async () => {
        let cache;
        // TODO_CURRENT React компонент запрашивает данные у ListUi
        // Как построить сквозной тест:
        //     - Данные есть в БД
        //     - На БД уходит запрос с фильтрами
        //     - Данные доходят до компонента
        //     - React компонент осуществляет action
        //     - удаляет элемент
        //     - React компонент получает обновление от своих действий
        expect("Ok if not thrown").to.equal("Ok if not thrown TODO");
    });

    xit("action update", async () => {
        let cache;
        // TODO_CURRENT React компонент запрашивает данные у ListUi
        // Как построить сквозной тест:
        //     - Данные есть в БД
        //     - На БД уходит запрос с фильтрами
        //     - Данные доходят до компонента
        //     - React компонент осуществляет action
        //     - изменяет элемент так, что он уходит за пределы списка
        //     - React компонент получает обновление от своих действий
        expect("Ok if not thrown").to.equal("Ok if not thrown TODO");
    });

    xit("others create", async () => {
        let cache;
        // TODO_CURRENT React компонент запрашивает данные у ListUi
        // Как построить сквозной тест:
        //     - Данные есть в БД
        //     - ListUi шлет action
        //     - Данные в кеше изменяются ДРУГОЙ СЕССИЕЙ - создается объект, подпадающий под критерии
        //     - Компонент получает новые данные сразу
        //     - React компонент получает обновление от ЧУЖИХ действий
        expect("Ok if not thrown").to.equal("Ok if not thrown TODO");
    });

    xit("others remove", async () => {
        let cache;
        // TODO_CURRENT React компонент запрашивает данные у ListUi
        // Как построить сквозной тест:
        //     - Данные есть в БД
        //     - ListUi шлет action
        //     - Данные в кеше изменяются ДРУГОЙ СЕССИЕЙ - удаляется объект, подпадающий под критерии
        //     - Компонент получает новые данные сразу
        //     - React компонент получает обновление от ЧУЖИХ действий
        expect("Ok if not thrown").to.equal("Ok if not thrown TODO");
    });

    xit("others update", async () => {
        let cache;
        // TODO_CURRENT React компонент запрашивает данные у ListUi
        // Как построить сквозной тест:
        //     - Данные есть в БД
        //     - ListUi шлет action
        //     - Данные в кеше изменяются ДРУГОЙ СЕССИЕЙ - изменяется объект, подпадающий под критерии
        //     - Компонент получает новые данные сразу
        //     - React компонент получает обновление от ЧУЖИХ действий
        expect("Ok if not thrown").to.equal("Ok if not thrown TODO");
    });
    //------------------
    it("simple request", async () => {
        let t = await setup();
    });

    it("ListController.query", async () => {
        let t = await setup();
        expect(plainExData(await t.list1.query([]))).deep.equal(t.tasksEtalon(0, 100, true));
    });

    it("simple xquery await", async () => {
        let t = await setup();
        let sortedData = t.domain.queryAll.upsertSortedData([]);
        let listData = await sortedData.get();

        expect(listData.map((a) => a.id)).to.deep.equal(t.tasks.map((a: any) => a.id));
        expect(sortedData && sortedData.dbgSync()).to.deep.equal(
            t.tasks.map((a: any) => {
                a["!"] = "HastyData.Persistent";
                return a;
            }),
        );
    });

    it("simple listUi no-wait", async () => {
        let t = await setup();
        expect(t.list1Ui.dbgSync()).to.deep.equal([
            {
                interval: {
                    a: { v: -Infinity, bias: 1 },
                    b: { v: Infinity, bias: -1 },
                },
                state: "notloaded",
            },
        ]);
    });

    it("simple listUi (from preloaded)", async () => {
        let t = await setup();
        let sortedData = t.domain.queryAll.upsertSortedData([]);
        let listData = await sortedData.get();
        let dbgAsyncResult = await t.list1Ui.dbgAsync();
        expect(t.list1Ui.dbgSync()).to.deep.equal(
            t.tasks.map((a: any) => {
                a["!"] = "HastyData.Persistent";
                return a;
            }),
        );
    });

    it("ListUi first render with data, repetive", async () => {
        let t = await setup();
        await preload(t);

        console.log("render - 1");
        let data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(0, 10, true));

        (t.list1Ui as any)._staleView = true;

        await waitForLoad(t);
        expect(t.list1Ui.dbgSync().length).to.equal(100);

        data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(0, 10, true));

        await waitForLoad(t);

        data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(0, 10, true));
    });

    it("condition (from preloaded)", async () => {
        let t = await setup();
        await preload(t);

        t.list1Ui.setCondition("n >= 50");

        let data = t.list1Ui.getData();

        await waitForLoad(t);

        let data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(50, 10, true));
    });

    it("condition (not preloaded)", async () => {
        let t = await setup();

        // SqliteClient
        t.list1Ui.setCondition("n >= 50");

        let data = t.list1Ui.getData();
        expect(plainExData(data)).deep.equal([]);

        expect(t.list1Ui.getStartingLoader()).equal(true);
        expect(t.list1Ui.getEndingLoader()).equal(true);

        await waitForLoad(t);

        let data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(50, 10, true));
    });

    it("condition n>=50", async () => {
        let t = await setup();
        await preload(t);

        t.list1Ui.setCondition("n >= 50");

        await waitForLoad(t);

        let data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(50, 10, true));
    });

    it("quickFilters n>=50", async () => {
        let t = await setup();

        await preload(t);

        t.list1Ui.setQuickFilters([
            {
                field: "n",
                include: [{ mode: ">=", a: 50 }],
                exclude: [],
            },
        ]);
        t.list1Ui.refreshIfStale();

        let etalon: any = [];
        for (let x of t.tasks) if ((x.name.includes("ask0") || x.name.includes("ask1")) && x.name !== "task05") etalon.push(x);

        let data = t.list1Ui.getData();
        await waitForLoad(t);

        let data2 = t.list1Ui.getData();
        expect(plainExData(data2)).deep.equal(t.tasksEtalon(50, 10, true));
    });
});
*/