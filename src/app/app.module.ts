import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HistoryContainerComponent } from './history/history-container/history-container.component';
import { RouterModule } from '@angular/router';
import { HistoryItemComponent } from './history/history-item/history-item.component';
import { BackgroundComponent } from './background/background.component';
import { FormsModule } from '@angular/forms';
import { PrettifyHistoryValuePipe } from './shared/pipes/prettify-history-value.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HistoryContainerComponent,
    HistoryItemComponent,
    PrettifyHistoryValuePipe,
    BackgroundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'history', component: HistoryContainerComponent },
      { path: 'history/:shortLink', component: HistoryContainerComponent },
      { path: '', component: BackgroundComponent }
    ], { useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
