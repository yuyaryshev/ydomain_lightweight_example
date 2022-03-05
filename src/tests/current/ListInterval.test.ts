import { assert, expect } from "chai";
import { ISaInterval, makeSaInterval, saValidateOne, seq_merge, seq_split } from "@yuyaryshev/yquery_core";
// import { ISaInterval, makeSaInterval, saValidateOne, seq_merge, seq_split } from "@yuyaryshev/yTBDREMH2";

type TestSaInterval = ISaInterval<any>;

describe("ListInterval.test.ts", () => {
    describe("seq_merge", () => {
        it("seq_merge - merged", async () => {
            let intervals: TestSaInterval[] = [makeSaInterval("notloaded", 5), makeSaInterval("loaded", [1, 2])];
            let addedIntervals: TestSaInterval[] = [makeSaInterval("loaded", [3]), makeSaInterval("notloaded", 5)];

            let r = seq_merge(intervals, addedIntervals);
            expect(r).to.deep.equal([makeSaInterval("notloaded", 5), makeSaInterval("loaded", [1, 2, 3]), makeSaInterval("notloaded", 5)]);
        });

        it("seq_merge - merged notloaded", async () => {
            let intervals: TestSaInterval[] = [makeSaInterval("notloaded", 3)];
            let addedIntervals: TestSaInterval[] = [makeSaInterval("notloaded", 2)];

            let r = seq_merge(intervals, addedIntervals);
            expect(r).to.deep.equal([makeSaInterval("notloaded", 5)]);
        });

        it("seq_merge - appended", async () => {
            let intervals: TestSaInterval[] = [makeSaInterval("notloaded", 5)];
            let addedIntervals: TestSaInterval[] = [makeSaInterval("loaded", [1, 2, 3])];

            let r = seq_merge(intervals, addedIntervals);
            expect(r).to.deep.equal([makeSaInterval("notloaded", 5), makeSaInterval("loaded", [1, 2, 3])]);
        });

        it("seq_merge - empty hastyData", async () => {
            let intervals: TestSaInterval[] = [];
            let addedIntervals: TestSaInterval[] = [makeSaInterval("notloaded", 5)];

            let r = seq_merge(intervals, addedIntervals);
            expect(r).to.deep.equal([makeSaInterval("notloaded", 5)]);
        });

        it("seq_merge - empty source", async () => {
            let intervals: TestSaInterval[] = [makeSaInterval("notloaded", 5)];
            let addedIntervals: TestSaInterval[] = [];

            let r = seq_merge(intervals, addedIntervals);
            expect(r).to.deep.equal([makeSaInterval("notloaded", 5)]);
        });

        it("seq_merge - count instead of data", async () => {
            let intervals: TestSaInterval[] = [makeSaInterval("notloaded", 5)];

            try {
                let addedIntervals: TestSaInterval[] = [makeSaInterval("loaded", 10)];

                let r = seq_merge(intervals, addedIntervals);
            } catch (e) {
                expect((e as any).message).to.equal("Data expected for 'input'");
                return;
            }

            assert.fail("No error", "Validation error", "For this data validator should throw a validation error.");
        });

        it("seq_merge - data instead of count", async () => {
            let intervals: TestSaInterval[] = [makeSaInterval("notloaded", 5)];

            try {
                let addedIntervals: TestSaInterval[] = [makeSaInterval("notloaded", [1, 2, 3])];

                let r = seq_merge(intervals, addedIntervals);
            } catch (e) {
                expect((e as any).message).to.equal("Count = number > 0 expected for 'input'");
                return;
            }

            assert.fail("No error", "Validation error", "For this data validator should throw a validation error.");
        });
    });

    describe("seq_split", () => {
        it("seq_split - offset at interval middle", async () => {
            let intervals: TestSaInterval[] = [makeSaInterval("notloaded", 5), makeSaInterval("loaded", [1, 2, 3]), makeSaInterval("notloaded", 5)];
            let second_start = 7;
            let r = seq_split(intervals, second_start);
            expect(r).to.deep.equal({
                a: [makeSaInterval("notloaded", 5), makeSaInterval("loaded", [1, 2])],
                b: [makeSaInterval("loaded", [3]), makeSaInterval("notloaded", 5)],
            });
        });

        it("seq_split - offset at interval middle - not loaded", async () => {
            let intervals: TestSaInterval[] = [makeSaInterval("notloaded", 5), makeSaInterval("loaded", [1, 2, 3]), makeSaInterval("notloaded", 5)];
            let second_start = 3;
            let r = seq_split(intervals, second_start);
            expect(r).to.deep.equal({
                a: [makeSaInterval("notloaded", 3)],
                b: [makeSaInterval("notloaded", 2), makeSaInterval("loaded", [1, 2, 3]), makeSaInterval("notloaded", 5)],
            });
        });

        it("seq_split - offset at interval start", async () => {
            let intervals: TestSaInterval[] = [makeSaInterval("notloaded", 5), makeSaInterval("loaded", [1, 2, 3]), makeSaInterval("notloaded", 5)];
            let second_start = 5;
            let r = seq_split(intervals, second_start);
            expect(r).to.deep.equal({
                a: [makeSaInterval("notloaded", 5)],
                b: [makeSaInterval("loaded", [1, 2, 3]), makeSaInterval("notloaded", 5)],
            });
        });

        it("seq_split - empty", async () => {
            let intervals: TestSaInterval[] = [];
            let second_start = 0;
            let r = seq_split(intervals, second_start);
            expect(r).to.deep.equal({ a: [], b: [] });
        });

        it("seq_split - appendOrdered to the end", async () => {
            let intervals: TestSaInterval[] = [makeSaInterval("notloaded", 5), makeSaInterval("loaded", [1, 2, 3]), makeSaInterval("notloaded", 5)];
            let second_start = 13;
            let r = seq_split(intervals, second_start);
            expect(r).to.deep.equal({
                a: [makeSaInterval("notloaded", 5), makeSaInterval("loaded", [1, 2, 3]), makeSaInterval("notloaded", 5)],
                b: [],
            });
        });

        it("seq_split - offset negative", async () => {
            let intervals: TestSaInterval[] = [makeSaInterval("notloaded", 5), makeSaInterval("loaded", [1, 2, 3]), makeSaInterval("notloaded", 5)];
            let second_start = -1;
            let r: any;
            try {
                r = seq_split(intervals, second_start);
                console.log("r=", r);
            } catch (e) {
                expect((e as any).message).to.equal(`second_start can't be negative`);
                return;
            }
            assert.fail("No error", "Validation error", "For this data validator should throw a validation error.");
        });

        // it('seq_split - offset out of range', async () => {
        //     let intervals: TestSaInterval[] = [
        //         makeSaInterval('notloaded', 5),
        //         makeSaInterval('loaded', [1,2,3]),
        //         makeSaInterval('notloaded', 5),
        //     ];
        //     let second_start = 14;
        //     let r: any;
        //     try {
        //         r = seq_split(intervals, second_start);
        //         console.log('r=', r);
        //     } catch (e) {
        //         expect(e.message).to.equal2(`second_start=${14} is out of range (max=${13})`);
        //         return
        //     }
        //     assert.fail("No error", "Validation error", "For this data validator should throw a validation error.");
        // });
    });

    describe("validate", () => {
        it("validateOne - negative count", async () => {
            let interval = makeSaInterval("notloaded", 5);
            (interval as any).count = -5;
            try {
                saValidateOne(interval);
            } catch (e) {
                return;
            }
            assert.fail("No error", "Validation error", "For this data validator should throw a validation error.");
        });
    });
});
