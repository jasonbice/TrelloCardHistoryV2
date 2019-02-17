import { ITrelloHistoryData } from './trello-history-data.model';
import { ITrelloMemberCreator } from './trello-member-creator.model';

export interface ITrelloHistoryDataObj {
    data: ITrelloHistoryData;
    date: Date;
    id: string;
    idMemberCreator: string;
    memberCreator: ITrelloMemberCreator;
    type: string;
}