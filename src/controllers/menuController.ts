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
            message: 'Menu berhasil ditampilkan'
        }).status(200) //100 200 Berhasil
    }
    catch (eror) {
        return response
            .json({
                status: false,
                message: `Yah Error ${eror}`
            })
            .status(400)
    }
}

export const createMenu = async (request: Request, response: Response) => {
    try {
        const { name, price, category, description } = request.body
        const uuid = uuidv4()

        let filename = "" //untuk upload foto menu
        if (request.file) filename = request.file.filename

        const newMenu = await prisma.menu.create({ //await menunngu lalu dijalankan
            data: { uuid, name, price: Number(price), category, description, picture:filename }
        })
        return response.json({
            status: true,
            data: newMenu,
            message: `Buat menu bisa yaa`
        }).status(200);
    }
    catch (eror) {
        return response
            .json({
                status: false,
                message: `Buat menu error :( ${eror}`
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
            .json({ status: false, message: 'Menunya nda ada' })

        let filename = findMenu.picture
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/../public/menu_picture${findMenu.picture}`
            let exists = fs.existsSync(path)
            if (exists && findMenu.picture !== ``) fs.unlinkSync(path)
        }

        const updateMenu = await prisma.menu.update({
            data: {
                name: name || findMenu.name, //or untuk perubahan (kalau ada yang kiri dijalankan, misal tidak ada dijalankan yang kanan)
                price: price ? Number(price) : findMenu.price, //operasi tenary (sebelah kiri ? = kondisi (price) jika kondisinya true (:) false )
                category: category || findMenu.category,
                description: description || findMenu.description,
                picture : filename
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updateMenu,
            message: 'Update menu bisa yaa'
        })

    } catch (error) {
        return response
            .json({
                status: false,
                message: `Eror Sam ${error}`
            })
            .status(400)
    }
}

export const deleteMenu = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } })
        if (!findMenu) return response
            .status(200)
            .json({ status: false, message: 'Menunya nda ada' })

            let path = `${BASE_URL}/../public/menu_picture/$(findMenu.picture)`
            let exists = fs.existsSync(path)
            if (exists && findMenu.picture !== ``) fs.unlinkSync(path)

        const deletedMenu = await prisma.menu.delete({
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: deleteMenu,
            message: 'Menunya bisa dihapus yaa'
        }).status(200)
    } catch (eror) {
        return response
            .json({
                status: false,
                message: `Yah Error :( ${eror}`
            }).status(400)
    }
}