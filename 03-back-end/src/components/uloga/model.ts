import IModel from "../../common/IModel.interface";
import GlumacModel from "../glumac/model";
import PredstavaModel from "../predstava/model";

class UlogaModel implements IModel {
    ulogaId: number;
	role: string;
	glumacId: number | null = null;
    glumac: GlumacModel | null = null;
	predstavaId: number | null = null;
    predstava: PredstavaModel | null = null;
}
export default UlogaModel;
