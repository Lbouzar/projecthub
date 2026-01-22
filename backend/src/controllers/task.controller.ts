import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, assigneeId } = req.body;
    const userId = req.user?.id;

    // Verify task exists and user has access
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        column: {
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
        },
      },
    });

    if (!existingTask) {
      throw new AppError('Task not found', 404);
    }

    // Check access
    if (existingTask.column.board.project.ownerId !== userId && existingTask.column.board.project.members.length === 0) {
      throw new AppError('Access denied', 403);
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assigneeId !== undefined && { assigneeId }),
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
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Verify task exists and user has access
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        column: {
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
        },
      },
    });

    if (!existingTask) {
      throw new AppError('Task not found', 404);
    }

    // Check access
    if (existingTask.column.board.project.ownerId !== userId && existingTask.column.board.project.members.length === 0) {
      throw new AppError('Access denied', 403);
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const moveTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { columnId, position } = req.body;
    const userId = req.user?.id;

    if (!columnId || position === undefined) {
      throw new AppError('columnId and position are required', 400);
    }

    // Verify task exists and user has access
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        column: {
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
        },
      },
    });

    if (!existingTask) {
      throw new AppError('Task not found', 404);
    }

    // Check access
    if (existingTask.column.board.project.ownerId !== userId && existingTask.column.board.project.members.length === 0) {
      throw new AppError('Access denied', 403);
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        columnId,
        position,
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
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
