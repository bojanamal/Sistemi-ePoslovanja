import IErrorResponse from "../../common/IErrorResponse.interface";
import BaseService from "../../common/BaseService";
import { IAddPredstava } from "./dto/IAddPredstava";
import { IEditPredstava } from "./dto/IEditPredstava";
import PredstavaModel from "./model";
import DvoranaModel from "../dvorana/model";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IArticlePredstavaValue } from "../article/dto/IAddArticle";

class PredstavaModelAdapterOptions implements IModelAdapterOptions {
    loadParentDvorana: boolean = false;
}

class PredstavaService extends BaseService<PredstavaModel> {
    async adaptToModel(
        data: any,
        options: Partial<PredstavaModelAdapterOptions>,
    ): Promise<PredstavaModel> {
        const item: PredstavaModel = new PredstavaModel();
        item.predstavaId = Number(data?.predstava_id);
        item.name = data?.naziv;
		item.summary = data?.kratak_opis;
		item.image_path = data?.slika_postera;
        item.duration = Number(data?.trajanje);
		item.actors = data?.spisak_glumaca;
		item.dvoranaId = Number(data?.dvorana_id);
        if (options.loadParentDvorana && item.starting_airport_id !== null) {
            item.dvorana = await this.services.dvoranaService.getById(item.starting_airport_id);
        }
        return item;
    }

    public async getById(predstavaId: number, options: Partial<PredstavaModelAdapterOptions> = {}): Promise<PredstavaModel|null> {
        return super.getByIdFromTable<PredstavaModelAdapterOptions>("predstava", predstavaId, options);
    }

    public async getAllByParentDvoranaId(starting_airport_id: number): Promise<PredstavaModel[]> {
        const firstParent = await this.services.dvoranaService.getById(starting_airport_id, {
            loadPredstave: false,
            loadParentCategories: false,
            loadSubcategories: false,
        });
        if (!(firstParent instanceof DvoranaModel)) {
            return [];
        }
        const predstave: PredstavaModel[] = [];
        let currentParent: DvoranaModel|null = firstParent;
        while (currentParent !== null) {
            predstave.push(... await super.getByFieldIdFromTable<PredstavaModelAdapterOptions>("predstava", "dvorana_id", currentParent.starting_airport_id));
            currentParent = await this.services.dvoranaService.getById(currentParent.parentDvoranaId, {
                loadParentCategories: false,
                loadSubcategories: false,
                loadPredstave: false,
            });
        }
        return predstave;
    }

    public async add(data: IAddPredstava): Promise<PredstavaModel|IErrorResponse> {
        return new Promise<PredstavaModel|IErrorResponse>((result) => {
            const sql: string = "INSERT predstava SET naziv = ?, kratak_opis = ?, slika_postera = ?, trajanje = ?, spisak_glumaca = ?, dvorana_id = ?;";
            this.db.execute(sql, [data.name, data.summary, data.image_path, data.duration, data.actors, data.dvoranaId])
                .then(async res => {
                    const resultData: any = res;
                    const newId: number = Number(resultData[0]?.insertId);
                    result(await this.getById(newId, { loadParentDvorana: true, }));
                })
                .catch(err => {
                    result({
                        errorCode: err?.errno,
                        message: err?.sqlMessage,
                    });
                });
        });
    }

    public async edit(id: number, data: IEditPredstava): Promise<PredstavaModel|IErrorResponse> {
        return new Promise<PredstavaModel|IErrorResponse>((result) => {
            const sql: string = `
                UPDATE
                    predstava
                SET
                    naziv = ?, kratak_opis = ?, slika_postera = ?, trajanje = ?, spisak_glumaca = ?
                WHERE
                    predstava_id = ?;`;

            this.db.execute(sql, [data.name, data.summary, data.image_path, data.duration, data.actors, id])
                .then(async res => {
                    result(await this.getById(id, { loadParentDvorana: true }));
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
            const sql: string = "DELETE FROM predstava WHERE predstava_id = ?;";

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
export default PredstavaService;
