import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getBoard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const board = await prisma.board.findUnique({
      where: { id },
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
        columns: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!board) {
      throw new AppError('Board not found', 404);
    }

    // Check if user has access to the project
    if (board.project.ownerId !== userId && board.project.members.length === 0) {
      throw new AppError('Access denied', 403);
    }

    res.json({
      success: true,
      data: board,
    });
  } catch (error) {
    next(error);
  }
};

export const getBoardColumns = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // First verify the board exists and user has access
    const board = await prisma.board.findUnique({
      where: { id },
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
    });

    if (!board) {
      throw new AppError('Board not found', 404);
    }

    // Check if user has access
    if (board.project.ownerId !== userId && board.project.members.length === 0) {
      throw new AppError('Access denied', 403);
    }

    const columns = await prisma.column.findMany({
      where: {
        boardId: id,
      },
      orderBy: {
        position: 'asc',
      },
    });

    res.json({
      success: true,
      data: columns,
    });
  } catch (error) {
    next(error);
  }
};
