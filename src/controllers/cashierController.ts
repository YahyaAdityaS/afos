import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCashierDashboard = async (req: Request, res: Response) => {
  try {
    const totalMenus = await prisma.menu.count();
    const favoriteMenu = await prisma.menu.findFirst(); // Sesuaikan dengan data favorit
    const totalOrders = await prisma.order.count();

    // Contoh statistik menu (sesuaikan dengan database-mu)
    const menuStats = await prisma.menu.findMany({
      select: {
        name: true,
        _count: { select: { order: true } },
      },
    });

    const formattedStats = menuStats.map(menu => ({
      name: menu.name,
      value: menu._count.order,
    }));

    return res.json({
      totalMenus,
      favoriteMenu: favoriteMenu ? favoriteMenu.name : "Belum ada",
      totalOrders,
      menuStats: formattedStats,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};