import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { concat } from "rxjs/operator/concat";

import { ImageService } from "@app/_services/image.service";
import { WindowRef } from "@app/WindowRef";

import { Metadata, Annotation } from "@app/models";

declare var $: any;

@Component({
  selector: "app-commander",
  templateUrl: "./commander.component.html"
})
export class CommanderComponent implements OnInit {
  constructor(
    private imageService: ImageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private windowRef: WindowRef
  ) { }

  ip: string;
  image: HTMLImageElement;
  metadata: Metadata;
  imageId = "imageId";
  canvasId = "canvasId";
  dronePicturePath = "./assets/graphics/drone_pointer.png";
  normalPersonPicturePath = "./assets/graphics/person_marker_normal.png";
  injuredPersonPicturePath = "./assets/graphics/person_marker_urgent.png";
  carPicturePath = "./assets/graphics/car.PNG";
  normalPersonPicture: HTMLImageElement;
  injuredPersonPicture: HTMLImageElement;
  carPicture: HTMLImageElement;

  falseOption: boolean = false;
  trueOption: boolean = true;
  sendImageRequest: boolean = false;
  factorCalculated: boolean = false;
  xFactor: number;
  yFactor: number;

  carsEnabled: boolean = false;
  humansEnabled: boolean = false;
  standPersonLabel: string = "stehende Personen";
  liePersonLabel: string = "stehende Personen";
  vehicleLabel: string = "Fahrzeuge";

  ngOnInit() {
    this.setJavascriptElements();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.ip = params["id"];
      let timer = Observable.timer(0, 100);
      timer.subscribe(t => {
        this.getImages(t);
      });
    });
  }

  setJavascriptElements(): void {
    this.setMap();
    this.indicatorBoxClick();
    this.setImages();
  }

  setImages(): void {
    this.normalPersonPicture = new Image();
    this.normalPersonPicture.src = this.normalPersonPicturePath;
    this.injuredPersonPicture = new Image();
    this.injuredPersonPicture.src = this.injuredPersonPicturePath;
    this.carPicture = new Image();
    this.carPicture.src = this.carPicturePath;
  }

  setMap(): void {
    document.getElementById("mainMap").style.height = window.innerHeight.toString() + "px";
    this.latCurrent = this.latStart;
    this.longCurrent = this.longCurrent;
    this.letTheDroneFly(400, 1);
    $('#droneSubmenu').collapse('show');
    $('#droneSubmenu .collapse').collapse('show');
    $('#faxSubmenu').collapse('show');
  }

  setSidebarTheme(): void {
    $(".components").mCustomScrollbar({
      theme: "minimal",
      setHeight: window.innerHeight - 200,
      advanced: {
        updateOnContentResize: true,
        updateOnImageLoad: true
      }
    });
  }

  indicatorBoxClick(): void {
    var indicatorBox = document.getElementById("hide_indicator_box");
    indicatorBox.onclick = function () {
      $("#sidebar").toggleClass("active");
      //dismiss sidebar
      if (!document.getElementById("sidebar").classList.contains("active")) {
        $(".collapse.in").toggleClass("in");
        $("a[aria-expanded=true]").attr("aria-expanded", "false");
        $("#sidebar_toggle").removeClass("glyphicon-chevron-left");
        $("#sidebar_toggle").addClass("glyphicon-chevron-right");
      } else {
        $("#sidebar_toggle").removeClass("glyphicon-chevron-right");
        $("#sidebar_toggle").addClass("glyphicon-chevron-left");
      }
    };
  }

  getImages(tick) {
    if (this.imageService != null && this.sendImageRequest) {
      this.sendImageRequest = false;
      this.imageService
        .getImage(this.ip)
        .then(response => this.createImageFromBlob(response))
        .catch(reason => {
          console.log(reason);
          this.sendImageRequest = true;
        });
    }
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        this.image = reader.result;
        this.getMetadata();
      },
      false
    );
    if (image) reader.readAsDataURL(image);
  }

  getMetadata() {
    this.imageService
      .getMetadata(this.ip)
      .then(response => {
        this.metadata = response;
        var imageObj = <HTMLImageElement>document.getElementById(this.imageId);
        this.calculateFactor(window.innerWidth, imageObj.width, window.innerHeight, imageObj.height);
        var ctx = this.getContext();
        ctx.drawImage(imageObj, 0, 0, ctx.canvas.width, ctx.canvas.height);
        this.drawMetadata(ctx);
        this.sendImageRequest = true;
      })
      .catch(reason => {
        console.log(reason);
        this.sendImageRequest = true;
      });
  }

  calculateFactor(newWidth: number, oldWidth: number, newHeight: number, oldHeight: number) {
    if (this.factorCalculated) return;
    this.xFactor = newWidth / oldWidth;
    this.yFactor = newHeight / oldHeight;
    var context = this.getContext();
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
  }

  private context: CanvasRenderingContext2D;
  getContext(): CanvasRenderingContext2D {
    if (this.context == null) {
      var canvas = <HTMLCanvasElement>document.getElementById(this.canvasId);
      this.context = canvas.getContext("2d");
    }
    return this.context;
  }

  drawMetadata(context: CanvasRenderingContext2D) {
    this.updateCarHeader();
    this.updatePersonHeader();

    if (this.carsEnabled) {
      context.beginPath();
      context.strokeStyle = "red";
      context.lineWidth = 4;
      for (let annotation of this.metadata.cars)
        context.rect(annotation.X_start * this.xFactor, annotation.Y_start * this.yFactor,
          (annotation.X_end - annotation.X_start) * this.xFactor, (annotation.Y_end - annotation.Y_start) * this.yFactor);
      context.stroke();
    }
    this.drawRectangles(context, this.metadata.people, this.normalPersonPicture, this.humansEnabled);
    this.drawRectangles(context, this.metadata.injury, this.injuredPersonPicture, this.humansEnabled);
  }

  drawRectangles(context: CanvasRenderingContext2D, annotations: Annotation[], picture: HTMLImageElement, draw: boolean) {
    if (draw == false) return;
    for (let annotation of annotations) {
      context.drawImage(picture, (annotation.X_start + (annotation.X_end - annotation.X_start) / 2) * this.xFactor, (annotation.Y_start - 25) * this.yFactor);
    }
    // context.rect(annotation.X_start * this.xFactor, annotation.Y_start * this.yFactor,
    //   (annotation.X_end - annotation.X_start) * this.xFactor, (annotation.Y_end - annotation.Y_start) * this.yFactor);
  }

  updatePersonHeader() {
    this.standPersonLabel = "stehende Personen: " + this.metadata.people.length;
    this.liePersonLabel = "liegende Personen: " + this.metadata.injury.length;
    this.updatePersonSubmenu();
  }

  personCount: number;
  injuredCount: number;
  updatePersonSubmenu() {
    if (this.metadata.people.length != this.personCount) {
      var pss = $("#personStandScale");
      pss.empty();
      for (var i = 0; i < this.metadata.people.length && i < 15; i++)
        pss.append('<img src="./../../assets/graphics/person_black.png" class="live_scale" style="height:15px; padding-right:2px;"/>');
      this.personCount = this.metadata.people.length;
    }
    if (this.metadata.injury.length != this.injuredCount) {
      var pls = $("#personLieScale");
      pls.empty();
      for (var i = 0; i < this.metadata.injury.length; i++)
        pls.append('<img src="./../../assets/graphics/person2_red1to1.png" class="live_scale" style="height:15px; padding-right:2px;"/>');
      this.injuredCount = this.metadata.injury.length;
    }
  }

  updateCarHeader() {
    this.vehicleLabel = "beteiligte Fahrzeuge: " + this.metadata.cars.length;
    this.updateCarSubmenu();
  }

  carCount: number;
  updateCarSubmenu() {
    if (this.metadata.cars.length == this.carCount) return;
    var vs = $("#vehicleScale");
    vs.empty();
    for (var i = 0; i < 20; i++) {
      vs.append('<img src="./../../assets/graphics/icon_car.png" class="live_scale" style="height:15px; padding-right:2px; />');
    }
    this.carCount = this.metadata.cars.length;
  }

  toggleHumans(): void {
    this.humansEnabled = !this.humansEnabled;
    this.setButtonColor("personViewToggleButton", this.humansEnabled);
  }

  toggleCars(): void {
    this.carsEnabled = !this.carsEnabled;
    this.setButtonColor("vehicleViewToggleButton", this.carsEnabled);
  }

  orignalColor: string;
  blueColor: string = 'rgb(0, 119, 255)';
  setButtonColor(id: string, applyColor: boolean) {
    var element = document.getElementById(id);
    if (this.orignalColor == null)
      this.orignalColor = element.style.background;
    if (!applyColor)
      element.style.background = this.orignalColor;
    else
      element.style.background = this.blueColor;
  }

  onShowCarList(): void {
    $('#carList').css('display', 'block');
  }

  closeCarList(): void {
    $('#carList').css('display', '');
  }

  addCar(): void {
    var inp = $('#carTypeInput').val();
    if (inp != '') {
      $('#safetyCardSubmenu').append('<li class="layer1" id="' + inp + '" >' + inp + '</li>');
    }
    $('#carTypeInput').val('')

    $('#' + inp).click(function () {
      $('#rettDB').css('display', 'block');
    });
    this.closeCarList();
  }

  closeRectangle(): void {
    $('#rettDB').css('display', '');
  }

  toggleAll(): void {
    if ($('[href="#incidentSubmenu"]').attr('aria-expanded') == 'false')
      $(".collapse").collapse("show");
    else
      $(".collapse").collapse('hide');
  }

  latCenter: number = 48.252498;
  longCenter: number = 11.440445;
  latStart: number = 48.260937;
  longStart: number = 11.443704;
  latEnd: number = 48.23925999999999;
  longEnd: number = 11.432070000000067;
  latCurrent: number = 48.260937;
  longCurrent: number = 11.443704;

  async letTheDroneFly(speed, distanceInKm) {
    var totalTimeMs, totalDistanceMeters;
    var remainingTimeInMs = distanceInKm / speed * 3600000;
    totalTimeMs = remainingTimeInMs;

    var passedTimeInMs = 0;
    var pLabel, rLabel, dLabel, pb, p, r;
    pLabel = document.getElementById("time_passed_label");
    rLabel = document.getElementById("time_remaining_label");
    dLabel = document.getElementById("distance_remaining_label");
    pb = document.getElementById("time_remaining");
    while (remainingTimeInMs >= 0) {
      p = new Date(passedTimeInMs);
      r = new Date(remainingTimeInMs);

      pLabel.innerText = p.getMinutes() + ":" + (p.getSeconds() < 10 ? ("0" + p.getSeconds()) : p.getSeconds());
      rLabel.innerText = "-" + r.getMinutes() + ":" + (r.getSeconds() < 10 ? "0" + (r.getSeconds()) : r.getSeconds());
      pb.setAttribute('aria-valuenow', (passedTimeInMs / totalTimeMs) + ';');
      pb.style.width = ((passedTimeInMs / totalTimeMs) * 100) + '%';
      dLabel.innerText = Math.round(distanceInKm * 1000 - speed * passedTimeInMs / 3600) + "m";

      remainingTimeInMs -= 1000;
      passedTimeInMs += 1000;

      await this.sleep(1000);
      this.updateDronePosition(passedTimeInMs / totalTimeMs);
    }

    $('#livelist').css('display', '');
    $('#droneProgressItem').css('display', 'none');
    $('#remainingDistanceItem').css('display', 'none');
    $("#waitingScreen").css('display', 'none');
    $(".collapse").collapse("hide");
    this.sendImageRequest = true;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateDronePosition(percentage) {
    this.latCurrent = percentage * (this.latEnd - this.latStart) + this.latStart;
    this.longCurrent = percentage * (this.longEnd - this.longStart) + this.longStart;
  }
}
