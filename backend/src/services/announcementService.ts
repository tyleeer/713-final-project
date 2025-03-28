import * as repo from "../repo/announcementRepo";

export function getAnnouncements() {
  return repo.getAnnouncements();
}

export function getAnnouncementsByStudent(studentId: number, advisorId: number) {
  return repo.getAnnouncementsByStudent(studentId, advisorId);
}

export function getAnnouncementsByAdvisor(advisorId: number) {
  return repo.getAnnouncementsByAdvisor(advisorId);
}
