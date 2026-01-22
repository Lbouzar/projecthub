import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to last 50 notifications
    });

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      throw new AppError('Notification not found', 404);
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    next(error);
  }
};

export const acceptInvitation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      throw new AppError('Notification not found', 404);
    }

    if (notification.type !== 'PROJECT_INVITED') {
      throw new AppError('This notification is not a project invitation', 400);
    }

    const data = notification.data as any;
    const { projectId, role } = data;

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: userId!,
        },
      },
    });

    if (existingMember) {
      // Mark notification as read
      await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      throw new AppError('You are already a member of this project', 400);
    }

    // Add user to project
    await prisma.projectMember.create({
      data: {
        projectId,
        userId: userId!,
        role: role || 'MEMBER',
      },
    });

    // Mark notification as read
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: 'Invitation accepted',
    });
  } catch (error) {
    next(error);
  }
};

export const declineInvitation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      throw new AppError('Notification not found', 404);
    }

    if (notification.type !== 'PROJECT_INVITED') {
      throw new AppError('This notification is not a project invitation', 400);
    }

    // Mark notification as read (declined)
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: 'Invitation declined',
    });
  } catch (error) {
    next(error);
  }
};
