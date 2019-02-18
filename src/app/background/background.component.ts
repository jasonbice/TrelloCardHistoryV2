import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './background.component.html'
})
export class BackgroundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("Background running");
  }

}
