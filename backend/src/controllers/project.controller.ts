import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    // Get projects where user is owner or member
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id;

    if (!name) {
      throw new AppError('Project name is required', 400);
    }

    // Create project with owner
    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        ownerId: userId!,
        status: 'ACTIVE',
        members: {
          create: {
            userId: userId!,
            role: 'ADMIN',
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    // Create default board with columns for the new project
    await prisma.board.create({
      data: {
        name: 'Main Board',
        projectId: project.id,
        columns: {
          create: [
            { title: 'To Do', position: 0 },
            { title: 'In Progress', position: 1 },
            { title: 'In Review', position: 2 },
            { title: 'Done', position: 3 },
          ],
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        boards: {
          include: {
            columns: {
              orderBy: {
                position: 'asc',
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectBoards = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Verify user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const boards = await prisma.board.findMany({
      where: {
        projectId: id,
      },
      include: {
        columns: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    res.json({
      success: true,
      data: boards,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectMembers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Verify user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.json({
      success: true,
      data: {
        owner: project.owner,
        members: project.members,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const inviteMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;
    const userId = req.user?.id;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    // Verify user is owner or admin of the project
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
                role: { in: ['ADMIN', 'OWNER'] },
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found or you do not have permission to invite members', 403);
    }

    // Find user by email
    const invitedUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!invitedUser) {
      throw new AppError('User with this email not found', 404);
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: invitedUser.id,
        },
      },
    });

    if (existingMember) {
      throw new AppError('User is already a member of this project', 400);
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.notification.findFirst({
      where: {
        userId: invitedUser.id,
        type: 'PROJECT_INVITED',
        isRead: false,
        data: {
          path: ['projectId'],
          equals: id,
        },
      },
    });

    if (existingInvitation) {
      throw new AppError('User already has a pending invitation to this project', 400);
    }

    // Create notification for invitation
    const inviter = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true },
    });

    await prisma.notification.create({
      data: {
        userId: invitedUser.id,
        type: 'PROJECT_INVITED',
        title: 'Project Invitation',
        message: `${inviter?.firstName} ${inviter?.lastName} invited you to join "${project.name}"`,
        data: {
          projectId: id,
          projectName: project.name,
          role: role || 'MEMBER',
          inviterId: userId,
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user?.id;

    // Verify user is owner or admin of the project
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
                role: { in: ['ADMIN', 'OWNER'] },
              },
            },
          },
        ],
      },
    });

    if (!project) {
      throw new AppError('Project not found or you do not have permission to remove members', 403);
    }

    // Cannot remove the owner
    if (project.ownerId === memberId) {
      throw new AppError('Cannot remove the project owner', 400);
    }

    // Remove member
    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: id,
          userId: memberId,
        },
      },
    });

    res.json({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
