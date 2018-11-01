import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private _eventUrl = "http://localhost:3000/api/events"
  private _specialUrl = "http://localhost:3000/api/specials"

  constructor(private http:HttpClient) { }
  
  getSpecialEvents(){
      return this.http.get<any>(this._specialUrl)
    }

  getEvents(){
    return this.http.get<any>(this._eventUrl)
  }
}
