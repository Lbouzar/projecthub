import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getColumnTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Verify column exists and user has access
    const column = await prisma.column.findUnique({
      where: { id },
      include: {
        board: {
          include: {
            project: {
              include: {
                members: {
                  where: {
                    userId: userId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!column) {
      throw new AppError('Column not found', 404);
    }

    // Check access
    if (column.board.project.ownerId !== userId && column.board.project.members.length === 0) {
      throw new AppError('Access denied', 403);
    }

    const tasks = await prisma.task.findMany({
      where: {
        columnId: id,
      },
      orderBy: {
        position: 'asc',
      },
      include: {
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // column id
    const { title, description, priority, dueDate, assigneeIds } = req.body;
    const userId = req.user?.id;

    if (!title) {
      throw new AppError('Task title is required', 400);
    }

    // Verify column exists and user has access
    const column = await prisma.column.findUnique({
      where: { id },
      include: {
        board: {
          include: {
            project: {
              include: {
                members: {
                  where: {
                    userId: userId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!column) {
      throw new AppError('Column not found', 404);
    }

    // Check access
    if (column.board.project.ownerId !== userId && column.board.project.members.length === 0) {
      throw new AppError('Access denied', 403);
    }

    // Get max position
    const maxPosition = await prisma.task.findFirst({
      where: { columnId: id },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        columnId: id,
        position: (maxPosition?.position ?? -1) + 1,
      },
      include: {
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
