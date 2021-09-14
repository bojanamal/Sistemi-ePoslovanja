import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../common/BaseService";
import { IAddUloga } from "./dto/IAddUloga";
import { IEditUloga } from "./dto/IEditUloga";
import UlogaModel from "./model";
import PredstavaModel from "../predstava/model";
import GlumacModel from "../glumac/model";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IArticleUlogaValue } from "../article/dto/IAddArticle";

class UlogaModelAdapterOptions implements IModelAdapterOptions {
    loadParentPredstava: boolean = false;
}

class UlogaService extends BaseService<UlogaModel> {
    async adaptToModel(
        data: any,
        options: Partial<UlogaModelAdapterOptions>,
    ): Promise<UlogaModel> {
        const item: UlogaModel = new UlogaModel();
        item.ulogaId = Number(data?.uloga_id);
		item.role = data?.naziv_ili_spisak_uloga;
		item.glumacId = Number(data?.glumac_id);
        item.predstavaId = Number(data?.predstava_id);
        if (options.loadParentPredstava && item.predstavaId !== null) {
            item.predstava = await this.services.predstavaService.getById(item.predstavaId);
        }
		if (options.loadParentGlumac && item.glumacId !== null) {
            item.glumac = await this.services.glumacService.getById(item.glumacId);
        }
        return item;
    }

    public async getById(ulogaId: number, options: Partial<UlogaModelAdapterOptions> = {}): Promise<UlogaModel|null> {
        return super.getByIdFromTable<UlogaModelAdapterOptions>("uloga", ulogaId, options);
    }

    public async getAllByParentPredstavaId(predstavaId: number): Promise<UlogaModel[]> {
        const firstParent = await this.services.predstavaService.getById(predstavaId, {
            loadUloge: false,
            loadParentCategories: false,
            loadSubcategories: false,
        });
        if (!(firstParent instanceof PredstavaModel)) {
            return [];
        }
        const uloge: UlogaModel[] = [];
        let currentParent: PredstavaModel|null = firstParent;
        while (currentParent !== null) {
            uloge.push(... await super.getByFieldIdFromTable<UlogaModelAdapterOptions>("uloga", "predstava_id", currentParent.predstavaId));
            currentParent = await this.services.predstavaService.getById(currentParent.parentPredstavaId, {
                loadParentCategories: false,
                loadSubcategories: false,
                loadUloge: false,
            });
        }
        return uloge;
    }
	
    public async getAllByParentGlumacId(glumacId: number): Promise<UlogaModel[]> {
        const firstParent = await this.services.glumacService.getById(glumacId, {
            loadUloge: false,
            loadParentCategories: false,
            loadSubcategories: false,
        });
        if (!(firstParent instanceof GlumacModel)) {
            return [];
        }
        const uloge: UlogaModel[] = [];
        let currentParent: GlumacModel|null = firstParent;
        while (currentParent !== null) {
            uloge.push(... await super.getByFieldIdFromTable<UlogaModelAdapterOptions>("uloga", "glumac_id", currentParent.glumacId));
            currentParent = await this.services.glumacService.getById(currentParent.parentGlumacId, {
                loadParentCategories: false,
                loadSubcategories: false,
                loadUloge: false,
            });
        }
        return uloge;
    }

    public async add(data: IAddUloga): Promise<UlogaModel|IErrorResponse> {
        return new Promise<UlogaModel|IErrorResponse>((result) => {
            const sql: string = "INSERT uloga SET naziv_ili_spisak_uloga = ?, glumac_id = ?, predstava_id = ?;";
            this.db.execute(sql, [data.role, data.glumacId, data.predstavaId])
                .then(async res => {
                    const resultData: any = res;
                    const newId: number = Number(resultData[0]?.insertId);
                    result(await this.getById(newId, { loadParentPredstava: true, }));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    public async edit(id: number, data: IEditUloga): Promise<UlogaModel|IErrorResponse> {
        return new Promise<UlogaModel|IErrorResponse>((result) => {
            const sql: string = `
                UPDATE
                    uloga
                SET
                    naziv_ili_spisak_uloga = ?
                WHERE
                    uloga_id = ?;`;
            this.db.execute(sql, [data.role, id])
                .then(async res => {
                    result(await this.getById(id, { loadParentPredstava: true }));
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
            const sql: string = "DELETE FROM uloga WHERE uloga_id = ?;";
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
export default UlogaService;
