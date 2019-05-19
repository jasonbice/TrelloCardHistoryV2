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
import { HistoryItemMenuComponent } from './history/history-item-menu/history-item-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    HistoryContainerComponent,
    HistoryItemComponent,
    PrettifyHistoryValuePipe,
    BackgroundComponent,
    HistoryItemMenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'history', component: HistoryContainerComponent },
      { path: 'history/:shortLink', component: HistoryContainerComponent },
      { path: '', component: BackgroundComponent }
    ], { useHash: true }),
    ToastrModule.forRoot({
      maxOpened: 1,
      onActivateTick: true,
      preventDuplicates: true,
      progressBar: true,
      timeOut: 2500
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
