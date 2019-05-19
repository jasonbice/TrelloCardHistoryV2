import { UpdateType } from './history/history-item.model';

export class CardUpdatedEventArgs {
    
    constructor(public updateType: UpdateType, public newValue: any) {

    }
}