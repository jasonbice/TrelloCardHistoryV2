import { ITrelloCard } from './trello-card.model';
import { ITrelloCardOldValues } from './trello-card-old-values.model';
import { ITrelloList } from './trello-list.model';
import { ITrelloBoard } from './trello-board.model';
import { ITrelloCardSource } from './trello-card-source.model';
import { ITrelloChecklist } from './trello-checklist.model';

export interface ITrelloHistoryData {
    board: ITrelloBoard;
    card: ITrelloCard;
    cardSource: ITrelloCardSource;
    checklist: ITrelloChecklist;
    list: ITrelloList
    old: ITrelloCardOldValues;
}