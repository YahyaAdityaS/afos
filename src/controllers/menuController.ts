import { Request, Response } from "express"; //impor ekspress
import { $Enums, PrismaClient, Status } from "@prisma/client"; //
import { request } from "http";
const { v4: uuidv4 } = require("uuid");
import { BASE_URL } from "../global";
import fs from "fs"
import { exist } from "joi";


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
            massage: 'Iki Isi Menu E Cah'
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
            massage: `Gawe Menu E Iso Cah`
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

export const updateMenu = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const { name, price, category, description } = request.body

        const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } })
        if (!findMenu) return response
            .status(200)
            .json({ status: false, massage: 'Ra Enek Menu E Cah' })

        const updateMenu = await prisma.menu.update({
            data: {
                name: name || findMenu.name, //or untuk perubahan (kalau ada yang kiri dijalankan, misal tidak ada dijalankan yang kanan)
                price: price ? Number(price) : findMenu.price, //operasi tenary (sebelah kiri ? = kondisi (price) jika kondisinya true (:) false )
                category: category || findMenu.category,
                description: description || findMenu.description
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updateMenu,
            massage: 'Update Menu Iso Cah'
        })

    } catch (error) {
        return response
            .json({
                status: false,
                massage: `Eror Sam ${error}`
            })
            .status(400)
    }
}

export const changePicture = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } })
        if (!findMenu) return response
            .status(200)
            .json({ status: false, message: 'Ra Nemu Menu E Sam' })
        let filename = findMenu.picture
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/../public/menu_picture/$(findMenu.picture)`
            let exists = fs.existsSync(path)
            if (exists && findMenu.picture !== ``) fs.unlinkSync(path)
        }
        const updatePicture = await prisma.menu.update({
            data: { picture: filename },
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: updatePicture,
            message: `Ganti Foto E Iso Cah`
        }).status(200)
    }
    catch (error) {
        return response.json({
            status: false,
            message: `Ganti Foto Gagal Sam`
        }).status(400)
    }
}

export const deleteMenu = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } })
        if (!findMenu) return response
            .status(200)
            .json({ status: false, message: 'Ra Nemu Menu E Sam' })

        const deletedMenu = await prisma.menu.delete({
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: deleteMenu,
            message: 'Menu E Iso Dihapus Sam'
        }).status(200)
    } catch (eror) {
        return response
            .json({
                status: false,
                message: `Eror Sam ${eror}`
            }).status(400)
    }
}