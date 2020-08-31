import { Component, Inject, OnInit} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProgramsService } from '../programs.service';

@Component({
  selector: 'app-tri001',
  templateUrl: './tri001.component.html'
})
export class Tri001Component implements OnInit{
  public tide: Array<WeatherTide> = new Array<WeatherTide>();
  public selectedData: WeatherTide; //所選的那一筆資料
  public selectTideData: Array<WeatherTide>; // 關鍵要new起來
  public weatherData: Array<WeatherElem> = new Array<WeatherElem>(); // 關鍵要new起來
  public dateData: Array<WeatherDate>; // 關鍵要new起來
  public selectedDate: Array<WeatherDate>;
  public reportData: Array<WeaterReport>;

  constructor(private programService: ProgramsService) { }
  ngOnInit(): void {
    this.getReportList();
  }
  getReportList() {
    this.programService.getYouBikeData().subscribe(
      (response: any) => {
        this.tide = response.cwbopendata.dataset.location;
        let stime = this.tide[0].weatherElement[0].time;
        for (var i = 0; i < stime.length; i++) {
          var date = stime[i].startTime.split("T")[0];
          this.tide[0].weatherElement[0].time[i].startTime = date;
        }
        this.dateData = this.tide[0].weatherElement[0].time;
        console.log(this.tide); //log接到的資料
      },
      (error: HttpErrorResponse) => this.programService.HandleError(error)
    );
  }

  getArea(weatherTide: WeatherTide, checked: boolean) {
    if (checked) {
      let tideArray = [];
      if (this.selectTideData != null) {
        for (var i = 0; i < this.selectTideData.length; i++) {
          tideArray.push(this.selectTideData[i]);
        }
      }
      tideArray.push(weatherTide);
      this.selectTideData = tideArray;
    } else {
      let tideArray = [];
      if (this.selectTideData != null) {
        for (var i = 0; i < this.selectTideData.length; i++) {
          if (this.selectTideData[i] != weatherTide) {
            tideArray.push(this.selectTideData[i]);
          }
        }
      }
      this.selectTideData = tideArray;
    }
    this.getReport();
  }

  getParam(date: WeatherDate, checked: boolean) {
    if (checked) {
      let dateArray = [];
      if (this.selectedDate != null) {
        for (var i = 0; i < this.selectedDate.length; i++) {
          dateArray.push(this.selectedDate[i]);
        }
      }
      dateArray.push(date);
      this.selectedDate = dateArray;
    } else {
      let dateArray = [];
      if (this.selectedDate != null) {
        for (var i = 0; i < this.selectedDate.length; i++) {
          if (this.selectedDate[i] != date) {
            dateArray.push(this.selectedDate[i]);
          }
        }
      }
      this.selectedDate = dateArray;
    }
    this.getReport();
  }

  getReport() {
    var elem = new Array();
    let returnArray = [];
    if (this.selectTideData != null) {
      for (var i = 0; i < this.selectTideData.length; i++) {
        let wx;
        let windDir;
        let windSpeed;
        let waveHeight;
        let waveType;
        let date
        var weather;
        weather = this.selectTideData[i].weatherElement;
        let location = this.selectTideData[i].locationName;
        if (this.selectedDate != null) {
          for (var j = 0; j < this.selectedDate.length; j++) {
            let report: WeaterReport = {};
            date = this.selectedDate[j].startTime;
            for (var k = 0; k < weather.length; k++) {
              var element;
              element = weather[k].elementName;
              for (var l = 0; l < weather[k].time.length; l++) {
                if (weather[k].time[l].startTime.split("T")[0] == date) {
                  if (element == 'Wx') {
                    wx = weather[k].time[l].parameter.parameterName;
                  }
                  if (element == 'WindDir') {
                    windDir = weather[k].time[l].parameter.parameterName;
                  }
                  if (element == 'WindSpeed') {
                    windSpeed = weather[k].time[l].parameter.parameterName;
                  }
                  if (element == 'WaveHeight') {
                    waveHeight = weather[k].time[l].parameter.parameterName;
                  }
                  if (element == 'WaveType') {
                    waveType = weather[k].time[l].parameter.parameterName;
                  }
                }
              }
            }
            report.location = location;
            report.date = date;
            report.wx = wx;
            report.windDir = windDir;
            report.windSpeed = windSpeed;
            report.waveHeight = waveHeight;
            report.waveType = waveType;
            returnArray.push(report);
            this.reportData = returnArray;
            console.log(this.reportData);
          }
        }
      }
    }
  }
}

interface WeatherTide {
  locationName: string; // 預報區域
  weatherElement: Array<WeatherElem>; // 天氣現象
}

interface WeatherElem {
  elementName: string; // 預報區域
  time: Array<WeatherDate>; // 時間
}

interface WeatherDate {
  paramater: string; // 現象
  startTime: string; // 起始時間
  endTime: string; // 結束時間
}

interface WeaterReport {
  location ?: string; // 海域
  date ?: string; // 日期
  wx ?: string; // 天氣現象
  windDir ?: string; // 風向
  windSpeed ?: string; // 風速
  waveHeight ?: string; // 浪高
  waveType ?: string; // 浪況
}
