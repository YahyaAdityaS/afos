import { Request, Response } from "express"; //impor ekspress
import { PrismaClient } from "@prisma/client"; //
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
            massage: 'Menus has retrived'
        }).status(200) //100 200 Berhasil
    }
    catch (eror) {
        return response
            .json({
                status: false,
                massage: `There is an error ${eror}`
            })
            .status(400)
    }
}
