import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HistoryContainerComponent } from './history/history-container/history-container.component';
import { RouterModule } from '@angular/router';
import { HistoryItemComponent } from './history/history-item/history-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HistoryContainerComponent,
    HistoryItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '**', component: HistoryContainerComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
