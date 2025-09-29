import MeetHttp from "@/modules/meet/infrastructure/meet.http";
import CheckinHttp from "@/modules/visitor/infrastructure/checkin.http";

export const outputs={
    meetOutput: new MeetHttp(),
    checkinOutput: new CheckinHttp()
}