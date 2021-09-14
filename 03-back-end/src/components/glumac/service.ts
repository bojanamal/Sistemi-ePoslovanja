import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../common/BaseService";
import { IAddGlumac } from "./dto/IAddGlumac";
import { IEditGlumac } from "./dto/IEditGlumac";
import GlumacModel from "./model";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IArticleGlumacValue } from "../article/dto/IAddArticle";

class GlumacModelAdapterOptions implements IModelAdapterOptions {
    loadOrders: boolean = false;
}

class GlumacService extends BaseService<GlumacModel> {
    async adaptToModel(
        data: any,
        options: Partial<GlumacModelAdapterOptions>,
    ): Promise<GlumacModel> {
        const item: GlumacModel = new GlumacModel();
        item.glumacId = Number(data?.glumac_id);
        item.name = data?.ime;
		item.surname = data?.prezime;
		item.bio = data?.biografija;
		item.image_path = data?.fotografija;
        return item;
    }

    public async getById(glumacId: number, options: Partial<GlumacModelAdapterOptions> = {}): Promise<GlumacModel|null> {
        return super.getByIdFromTable<GlumacModelAdapterOptions>("glumac", glumacId, options);
    }

    public async getAll(options: Partial<UserModelAdapterOptions> = {}): Promise<UserModel[]> {
        return super.getAllFromTable<UserModelAdapterOptions>("glumac", options);
    }

    public async add(data: IAddGlumac): Promise<GlumacModel|IErrorResponse> {
        return new Promise<GlumacModel|IErrorResponse>((result) => {
            const sql: string = "INSERT glumac SET ime = ?, prezime = ?, biografija = ?, fotografija = ?;";
            this.db.execute(sql, [data.name, data.surname, data.bio, data.image_path])
                .then(async res => {
                    const resultData: any = res;
                    const newId: number = Number(resultData[0]?.insertId);
                    result(await this.getById(newId));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    public async edit(id: number, data: IEditGlumac): Promise<GlumacModel|IErrorResponse> {
        return new Promise<GlumacModel|IErrorResponse>((result) => {
            const sql: string = `
                UPDATE
                    glumac
                SET
                    ime = ?,
					prezime = ?,
					biografija = ?,
					fotografija = ?,
                WHERE
                    glumac_id = ?;`;
            this.db.execute(sql, [data.name, data.surname, data.bio, data.image_path, id])
                .then(async res => {
                    result(await this.getById(id));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    public async delete(id: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>((result) => {
            const sql: string = "DELETE FROM glumac WHERE glumac_id = ?;";

            this.db.execute(sql, [id])
                .then(async res => {
                    const data: any = res;
                    result({
                        errorCode: 0,
                        message: `Deleted ${data[0].affectedRows} rows.`,
                    });
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }
}
export default GlumacService;
