import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HistoryContainerComponent } from './history/history-container/history-container.component';
import { RouterModule } from '@angular/router';
import { HistoryItemListComponent } from './history/history-item-list/history-item-list.component';
import { HistoryItemComponent } from './history/history-item/history-item.component';
import { StringTruncatePipe } from './shared/pipes/string-truncate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HistoryContainerComponent,
    HistoryItemListComponent,
    HistoryItemComponent,
    StringTruncatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '**', component: HistoryContainerComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
