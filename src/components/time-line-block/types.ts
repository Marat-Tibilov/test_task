export interface TimelineEvent {
    year: number;
    description: string;
}

export interface TimelinePeriod {
    startYear: number;
    endYear: number;
    events: TimelineEvent[];
}