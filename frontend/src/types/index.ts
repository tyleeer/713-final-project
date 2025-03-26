// Profile Interface
export interface Profile {
    id: number;
    firstName: string;
    lastName: string;
    department: string;
    profilePic: string | null;
    userId: number;
}

// Advisor Interface
export interface Advisor {
    id: number;
    profileId: number;
    profile: Profile;
}

// Announcement Interface
export interface Announcement {
    id: number;
    topic: string;
    content: string;
    fileUrl: string;
    advisorId: number;
    createdAt: string; // ISO date string
    advisor: Advisor;
}

// Root Interface
export interface AnnouncementResponse {
    announcement: Announcement[];
}