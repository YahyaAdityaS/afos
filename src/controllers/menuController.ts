import { Request, Response } from "express"; //impor ekspress
import { PrismaClient, Status } from "@prisma/client"; //
import { request } from "http";
const { v4: uuidv4 } = require("uuid");


const prisma = new PrismaClient({ errorFormat: "pretty" })
export const getAllMenus = async (request: Request, response: Response) => { //endpoint perlu diganti ganti pakai const kalau tetap let
    //menyiapkan data input dulu(request) --> request
    try {
        //input
        const { search } = request.query //query boleh ada atau tidak params harus ada
        //main
        const allMenus = await prisma.menu.findMany({
            where: { name: { contains: search?.toString() || "" } } //name buat mencari apa di seacrh, contains == like(mysql) [mengandung kata apa], OR/|| (Salah satu true semaunya all), ""untuk menampilkan kosong
        })
        //output
        return response.json({ //tampilkan juga statusnya(untuk inidkator)
            status: true,
            data: allMenus,
            massage: 'Menu e iso Cah'
        }).status(200) //100 200 Berhasil
    }
    catch (eror) {
        return response
            .json({
                status: false,
                massage: `Eror Sam ${eror}`
            })
            .status(400)
    }
}

export const createMenu = async (request: Request, response: Response) => {
    try {
        const { name, price, category, description } = request.body
        const uuid = uuidv4()

        const newMenu = await prisma.menu.create({ //await menunngu lalu dijalankan
            data: { uuid, name, price: Number(price), category, description }
        })
        return response.json({
            Status: true,
            data: newMenu,
            massage: `Gawe menu DONE`
        }).status(200);
    }
    catch (eror) {
        return response
            .json({
                status: false,
                massage: `Eror iii. $(eror)`
            }).status(400);
    }
}

