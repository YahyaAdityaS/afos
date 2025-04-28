import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";


const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAllOrders = async (request: Request, response: Response) => {
    try {
        /** get requested data (data has been sent from request) */
        const { search } = request.query

        /** process to get order, contains means search name or table number of customer's order based on sent keyword */
        const allOrders = await prisma.order.findMany({
            where: {
                OR: [
                    { customer: { contains: search?.toString() || "" } },
                    { table_number: { contains: search?.toString() || "" } }
                ]
            },
            orderBy: { createdAt: "desc" }, /** sort by descending order date */
            include: { order_list: true } /** include detail of order (item that sold) */
        })
        return response.json({
            status: true,
            data: allOrders,
            message: `Order list has retrieved`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const createOrder = async (request: Request, response: Response) => {
    try {
        // Mendapatkan data yang dikirimkan
        const { customer, table_number, payment_method, status, order_list } = request.body;

        // Pastikan semua field yang diperlukan ada
        if (!customer || !table_number || !payment_method || !status || !order_list) {
            return response.status(400).json({
                status: false,
                message: "Missing required fields"
            });
        }

        const uuid = uuidv4();
        let filename = ""; // Untuk upload foto menu
        if (request.file) filename = request.file.filename;

        // Hitung total harga
        let total_price = 0;
        for (let index = 0; index < order_list.length; index++) {
            const { idMenu } = order_list[index];
            const detailMenu = await prisma.menu.findFirst({
                where: {
                    id: Number(idMenu)
                }
            });

            if (!detailMenu) {
                return response.status(400).json({
                    status: false,
                    message: `Menu with id ${idMenu} is not found`
                });
            }

            total_price += (detailMenu.price * order_list[index].quantity);
        }

        // Simpan pesanan
        const newOrder = await prisma.order.create({
            data: { 
                uuid, 
                customer, 
                table_number, 
                total_price, 
                payment_method, 
                status 
            }
        });

        // Simpan detail pesanan
        for (let index = 0; index < order_list.length; index++) {
            const uuid = uuidv4();
            const { idMenu, quantity, note } = order_list[index];
            await prisma.order_list.create({
                data: {
                    uuid, 
                    idOrder: newOrder.id, 
                    idMenu: Number(idMenu), 
                    quantity: Number(quantity), 
                    note
                }
            });
        }

        return response.json({
            status: true,
            data: newOrder,
            message: "New order has been created"
        }).status(200);

    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `There was an error: ${error}`
        });
    }
};


export const deleteOrder = async (request: Request, response: Response) => {
    try {
        /** get id of order's id that sent in parameter of URL */
        const { id } = request.params


        /** make sure that data is exists in database */
        const findOrder = await prisma.order.findFirst({ where: { id: Number(id) } })
        if (!findOrder) return response
            .status(200)
            .json({ status: false, message: `Order is not found` })


        /** process to delete details of order */
        let deleteOrder_list = await prisma.order_list.deleteMany({ where: { idOrder: Number(id) } })
        /** process to delete of Order */
        let deleteOrder = await prisma.order.delete({ where: { id: Number(id) } })


        return response.json({
            status: true,
            data: deleteOrder,
            message: `Order has deleted`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const updateStatusOrder = async (request: Request, response: Response) => {
    try {
        /** get id of order's id that sent in parameter of URL */
        const { id } = request.params
        /** get requested data (data has been sent from request) */
        const { status } = request.body
        const user = request.body.user


        /** make sure that data is exists in database */
        const findOrder = await prisma.order.findFirst({ where: { id: Number(id) } })
        if (!findOrder) return response
            .status(200)
            .json({ status: false, message: `Order is not found` })


        /** process to update menu's data */
        const updatedStatus = await prisma.order.update({
            data: {
                status: status || findOrder.status,
                idUser: user.id ? user.id : findOrder.idUser
            },
            where: { id: Number(id) }
        })


        return response.json({
            status: true,
            data: updatedStatus,
            message: `Order has updated`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

