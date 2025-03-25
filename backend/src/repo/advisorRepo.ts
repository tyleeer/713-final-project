import { PrismaClient } from "@prisma/client";
import { Announcement, Comment, Reply } from "../models/types";

const prisma = new PrismaClient();

export function createAnnouncement(newAnnouncement: Announcement) {
    return prisma.announcement.create({
        data: newAnnouncement,
        include: {
            advisor: {
                include: {
                    profile: true
                }
            }
        }
    });
}

export function createComment(newComment: Comment) {
    return prisma.comment.create({
        data: newComment,
        include: {
            advisor: {
                include: {
                    profile: true
                }
            },
            student: {
                include: {
                    profile: true
                }
            }
        }
    });
}

export function createReply(newReply: Reply) {
    return prisma.reply.create({
        data: newReply,
        include: {
            comment: {
                include: {
                    replies: true
                }
            }
        }
    });
}

export function checkAdvisor(advisorId: number) {
    return prisma.advisor.findUnique({
        where: { id: advisorId }
    });
}

export function checkStudent(studentId: number) {
    return prisma.student.findUnique({
        where: { id: studentId }
    });
}

export function checkComment(commentId: number) {
    return prisma.comment.findUnique({
        where: { id: commentId }
    });
}