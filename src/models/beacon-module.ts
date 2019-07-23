export class BeaconModel {

    uuid: string;
    major: number;
    minor: number;
    rssi: number;
    tx:number;
    name:string;
    accuracy:number;
    constructor(public beacon: any) {
    this.uuid = beacon.uuid;
    this.major = beacon.major;
    this.minor = beacon.minor;
    this.rssi = beacon.rssi;
    this.tx=beacon.tx;
    this.name=beacon.name;
    this.accuracy=beacon.accuracy;
    }
    }