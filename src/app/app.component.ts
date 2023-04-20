import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Weather } from './model';
import { Observable, Subscription, firstValueFrom, lastValueFrom, map } from 'rxjs';

//you should not be doing this 
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
const WEATHER_API_KEY = "d4aea52bfe8c4d52d3aab135e13a663a"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  form!: FormGroup
  weather$!: Subscription
  weatherObs$!: Observable<Weather[]>
  weatherProm$!: Promise<Weather[]>

  result: Weather[] = []

  //remember to import HttpClientModule
  constructor(private fb: FormBuilder, private http: HttpClient,) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      city: this.fb.control('', [Validators.required])
    })
  }
  ngOnDestroy(): void {
    this.weather$.unsubscribe()
  }

  getWeatherWithObserable() {
    this.weatherObs$ = this.getWeather()
  }

  getWeatherWithPromise() {
    //converts the first value of the obserable
    //into a promise, lastValueFrom()
    firstValueFrom(
      //returns an observable
      this.getWeather()
    ).then(v => {
      console.info('resolved', v)
      this.result = v
    }).catch(err => {
      console.error('error', err)
    })
  }

  getWeatherWithPromise2() {
    //converts the first value of the obserable
    //into a promise, lastValueFrom()
    this.weatherProm$ = lastValueFrom(
      //returns an observable
      this.getWeather()
    )
  }

  getWeatherWithSubscription() {
    //unsuscribe first before subscirbing
    if (this.weather$)
      this.weather$.unsubscribe()

    this.getWeather()
      .subscribe({
        next: v => {
          console.info('----next')
          this.result = v
        },
        error: err => {
          console.error('----error')
        },
        complete: () =>
          console.error('----complete')
      })

  }


  getWeather() {
    const city = this.form.value['city']
    console.info(`>> city ${city}`)

    const params = new HttpParams()
      .set('q', city)
      .set('units', 'metric')
      .set('appid', WEATHER_API_KEY)

    //returns an observable
    return this.http.get<Weather>(WEATHER_URL, { params })
      .pipe(
        map((v: any) => {
          //.main..temp
          const temp = v['main']['temp']
          //.weather
          const weather = v['weather'] as any[]
          return weather.map(w => {
            return {
              // .weather[*].main
              main: w['main'],
              // .weather[*].description
              description: w['description'],
              // .weather[*].icon,
              icon: w['icon'],
              temperature: temp
            } as Weather
          })
        })
      )
  }
}
