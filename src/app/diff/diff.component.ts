import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { diff_match_patch } from 'diff-match-patch';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HistoryItem } from '../shared/models/history/history-item.model';

@Component({
  selector: 'diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.css']
})
export class DiffComponent implements OnInit {
  @Input() historyItem: HistoryItem;

  diffHtml: SafeHtml;

  constructor(private domSanitizer: DomSanitizer, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(this.historyItem.oldValueRaw, this.historyItem.newValueRaw);

    dmp.diff_cleanupSemantic(diff);

    const prettifiedHtml: string = dmp.diff_prettyHtml(diff);

    this.diffHtml = this.domSanitizer.bypassSecurityTrustHtml(prettifiedHtml);

    this.changeDetectorRef.detectChanges();
  }

}
