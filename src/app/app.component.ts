import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('hourHand', { static: false }) hourHand: ElementRef;
  @ViewChild('minuteHand', { static: false }) minuteHand: ElementRef;
  @ViewChild('secondHand', { static: false }) secondHand: ElementRef;

  timerId: any;

  date: Date;
  private secondSubject = new BehaviorSubject(0);
  private minuteSubject = new BehaviorSubject(0);
  private hourSubject = new BehaviorSubject(0);

  ngOnInit(): void {


  }

  ngAfterViewInit() {
    this.reset();
    this.timerId = this.getTime();
  }

  animateAnalogClock() {
    this.hourHand.nativeElement.style.transform
      = `translate3d(-50%, 0, 0) rotate(${(this.hourSubject.value * 30) + (this.minuteSubject.value * 0.5) + (this.secondSubject.value * (0.5 / 60))}deg)`;
    this.minuteHand.nativeElement.style.transform
      = `translate3d(-50%, 0, 0) rotate(${(this.minuteSubject.value * 6) + (this.secondSubject.value * 0.1)}deg)`;
    this.secondHand.nativeElement.style.transform
      = `translate3d(-50%, 0, 0) rotate(${this.secondSubject.value * 6}deg)`;
  }

  getTime() {
    return setInterval(() => {
      this.updateTime();
      this.animateAnalogClock();
    }, 1000);

  }

  updateTime() {
    const newSecond = (this.secondSubject.value + 1) % 60;
    const newMinute = newSecond === 0 ? ((this.minuteSubject.value + 1) % 60) : this.minuteSubject.value;
    const newHour = newMinute === 0 ? ((this.hourSubject.value + 1) % 24) : this.hourSubject.value;
    this.setSecond(newSecond);
    this.setHour(newHour);
    this.setMinute(newMinute);
  }

  reset(): void {
    const currentTime = new Date();
    this.setSecond(currentTime.getSeconds());
    this.setHour(currentTime.getHours());
    this.setMinute(currentTime.getMinutes());
  }


  public increaseHour(): void {
    this.setHour(this.hourSubject.value + 1);
  }
  public decreaseHour(): void {
    this.setHour(this.hourSubject.value - 1)
  }
  public increaseMin(): void {
    this.setMinute(this.minuteSubject.value + 1);
  }

  public decreaseMin(): void {
    this.setMinute(this.minuteSubject.value - 1);
  }

  public increaseSec(): void {
    this.setSecond(this.secondSubject.value + 1);
  }

  public decreaseSec(): void {
    this.setSecond(this.secondSubject.value - 1);
  }

  setSecond(second: number): void {
    this.secondSubject.next((second < 0 ? second + 60 : second) % 60);
  }
  setMinute(minute: number): void {
    this.minuteSubject.next((minute < 0 ? minute + 60 : minute) % 60);
  }
  setHour(hour: number): void {
    this.hourSubject.next((hour < 0 ? hour + 24 : hour) % 24);
  }
  public get second(): Observable<number> {
    return this.secondSubject.asObservable();
  }
  public get minute(): Observable<number> {
    return this.minuteSubject.asObservable();
  }
  public get hour(): Observable<number> {
    return this.hourSubject.asObservable();
  }
}