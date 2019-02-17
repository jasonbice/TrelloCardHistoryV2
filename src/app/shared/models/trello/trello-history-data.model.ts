import { ITrelloMemberCreator } from './trello-member-creator.model';
import { ITrelloCard } from './trello-card.model';
import { ITrelloCardOldValues } from './trello-card-old-values.model';
import { ITrelloList } from './trello-list.model';
import { ITrelloBoard } from './trello-board.model';

export interface ITrelloHistoryData {
    board: ITrelloBoard;
    card: ITrelloCard;
    list: ITrelloList
    old: ITrelloCardOldValues;
    date: string;
    id: string;
    idMemberCreator: string;
    memberCreator: ITrelloMemberCreator;
    type: string;
}