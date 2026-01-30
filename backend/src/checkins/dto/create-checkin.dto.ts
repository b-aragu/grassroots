export class CreateCheckinDto {
    missionId: string;
    userId: string;
    lat: number;
    lng: number;
    voiceNoteUrl?: string;
    photoUrls?: string[];
    surveyData?: any;
}
