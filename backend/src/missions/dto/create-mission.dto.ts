export class CreateMissionDto {
    wardId: string;
    location: string;
    geoLat: number;
    geoLng: number;
    assignedToId?: string;
}
