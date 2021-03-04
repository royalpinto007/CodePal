import * as vscode from "vscode";
import { ProblemsProvider } from "../../data_providers/problems/problem_data_provider";
import { allTags, statusofproblem, RatingsEnum } from "../../utils/consts";

const isNum = (val:string) => /^\d+$/.test(val); // check if a string has only digits

export const problemsFilterInput = async (problemProvider: ProblemsProvider):Promise<void> =>{
    
    let fromRating = await vscode.window.showInputBox({placeHolder:"Enter the rating's lower limit. Leave blank for defaulting to 0."}); 
    let toRating = await vscode.window.showInputBox({placeHolder:"Enter the rating's upper limit. Leave blank for defaulting to 4000."}); 
    let tags : string[] = []; // read tags here with quick input and assign to the variable
    let status: string[] = [];

    if(typeof(fromRating)==="string" && typeof(toRating)==="string"){

        if(toRating==="" || !isNum(toRating)){
            toRating = RatingsEnum.initialToRating.toString(); // invalid input so defaulting to max rating
        }
        if(fromRating==="" || !isNum(fromRating)){
            fromRating = RatingsEnum.initialFromRating.toString(); // invalid input so defaulting to min rating
        }

        const quickPick = vscode.window.createQuickPick(); // using quickPick to take multiple input
        quickPick.items = allTags.map(label => ({ label }));
        quickPick.canSelectMany = true; // enables choosing multiple tags
        
        quickPick.onDidAccept(() => { 

            quickPick.selectedItems.forEach(item => {
                tags.push(item.label); // pushing selected tags into array
            });

            const quickPicks = vscode.window.createQuickPick(); // using quickPick to take multiple input
            quickPicks.items = statusofproblem.map(label => ({ label }));
            quickPicks.canSelectMany = true; // enables choosing multiple tags
        
            quickPicks.onDidAccept(() => { 

                quickPicks.selectedItems.forEach(items => {
                    status.push(items.label); // pushing selected tags into array
                });
        
                quickPicks.hide();
                console.log(status);

                problemProvider.refresh(parseInt(String(fromRating)),parseInt(String(toRating)),tags, status);
            });

            quickPicks.onDidHide(() => quickPicks.dispose());
            quickPicks.show();
        
            quickPick.hide();

            //problemProvider.refresh(parseInt(String(fromRating)),parseInt(String(toRating)),tags, status);
        });

        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    }
};