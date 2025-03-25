import { Announcement, Comment, Reply } from "../models/types";
import * as repo from "../repo/advisorRepo";

export function createAnnouncement(newAnnouncement: Announcement) {
  return repo.createAnnouncement(newAnnouncement);
}

export function createComment(newComment: Comment) {
  return repo.createComment(newComment);
}

export function createReply(newReply: Reply) {
  return repo.createReply(newReply);
}

export function checkAdvisor(advisorId: number) {
  return repo.checkAdvisor(advisorId);
}

export function checkStudent(studentId: number) {
  return repo.checkStudent(studentId);
}

export function checkComment(commentId: number) {
  return repo.checkComment(commentId);
}

