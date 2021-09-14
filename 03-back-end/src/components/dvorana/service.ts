import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../common/BaseService";
import { IAddDvorana } from "./dto/IAddDvorana";
import { IEditDvorana } from "./dto/IEditDvorana";
import DvoranaModel from "./model";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IArticleDvoranaValue } from "../article/dto/IAddArticle";

class DvoranaModelAdapterOptions implements IModelAdapterOptions {
    loadOrders: boolean = false;
}

class DvoranaService extends BaseService<DvoranaModel> {
    async adaptToModel(
        data: any,
        options: Partial<DvoranaModelAdapterOptions>,
    ): Promise<DvoranaModel> {
        const item: DvoranaModel = new DvoranaModel();
        item.dvoranaId = Number(data?.dvorana_id);
        item.name = data?.naziv;
        return item;
    }
	
    public async getById(dvoranaId: number, options: Partial<DvoranaModelAdapterOptions> = {}): Promise<DvoranaModel|null> {
        return super.getByIdFromTable<DvoranaModelAdapterOptions>("dvorana", dvoranaId, options);
    }
	
    public async getAll(options: Partial<UserModelAdapterOptions> = {}): Promise<UserModel[]> {
        return super.getAllFromTable<UserModelAdapterOptions>("dvorana", options);
    }


    public async add(data: IAddDvorana): Promise<DvoranaModel|IErrorResponse> {
        return new Promise<DvoranaModel|IErrorResponse>((result) => {
            const sql: string = "INSERT dvorana SET naziv = ?;";
            this.db.execute(sql, [data.name])
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

    public async edit(id: number, data: IEditDvorana): Promise<DvoranaModel|IErrorResponse> {
        return new Promise<DvoranaModel|IErrorResponse>((result) => {
            const sql: string = `
                UPDATE
                    dvorana
                SET
                    naziv = ?,
                WHERE
                    dvorana_id = ?;`;
            this.db.execute(sql, [data.name, id])
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
            const sql: string = "DELETE FROM dvorana WHERE dvorana_id = ?;";
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
export default DvoranaService;
