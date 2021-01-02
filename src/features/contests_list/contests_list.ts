import fetch from "node-fetch";
import * as vscode from "vscode";
import { ContestClass } from "../../classes/contest";
import { ContestTreeItem } from "../../data_providers/contests/contest_tree_item";

const contestsList = async (
    contestsType: string
): Promise<ContestClass[]> => {
    let arr: ContestClass[] = [];
    return fetch("https://codeforces.com/api/contest.list?gym=false")
        .then((response: any) => {
            if (!response.ok) {
                throw new Error(response.error);
            } else {
                return response.json();
            }
        })
        .catch((err: any) => {
            console.log("fetch error " + err);
            return arr;
        })
        .then(async (users: { result: string | any[] }) => {
            for (let i:number = 0; i < users.result.length; i++) {
                let contestID = users.result[i].id;
                let type = "";
                let x = users.result[i].phase;
                if (x === "FINISHED") {
                    type = "Past";
                }
                if (x === "CODING") {
                    type = "Running";
                }
                if (x === "BEFORE") {
                    type = "Future";
                }
                if (type === contestsType) {
                    let c = new ContestClass(contestID, type,users.result[i].name);
                    arr.push(c);
                }
            }
            return arr;
        });
};

export const fetchContests = async (type: string): Promise<ContestTreeItem[]> => {
    let contests: ContestClass[] = await contestsList(type); //TODO: CALL FUNCTION THAT FETCHES CONTESTS IN PLACE OF []
    return contests.map<ContestTreeItem> (
        (contest): ContestTreeItem => {
            return new ContestTreeItem(
            `${contest.name}`,
            type === "Future"?"FutureContest":"contest",
            type === "Future"
                ? vscode.TreeItemCollapsibleState.None
                : vscode.TreeItemCollapsibleState.Collapsed,
            type,
            contest
            );
        }
    );
};