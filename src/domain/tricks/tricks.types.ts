export interface CreateTrickDto {
    name: string;
    videoURL: string;
    level: number;
}

export type UpdateTrickDto = CreateTrickDto;

export interface TrickDto {
    id: number;
    name: string;
    videoURL: string;
    level: number;
}
