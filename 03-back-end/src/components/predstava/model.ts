import IModel from "../../common/IModel.interface";
import DvoranaModel from "../dvorana/model";

class PredstavaModel implements IModel {
	predstavaId: number;
    name: string;
	summary: string;
    image_path: string;
    duration: number;
	actors: string;
    dvorana_id: number | null = null;
    dvorana: DvoranaModel | null = null;
}
export default PredstavaModel;
