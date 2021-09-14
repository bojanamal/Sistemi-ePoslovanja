import AdministratorService from "../components/administrator/service";
import DvoranaService from "../components/dvorana/service";
import GlumacService from "../components/glumac/service";
import PredstavaService from "../components/predstava/service";
import UlogaService from "../components/uloga/service";

export default interface IServices {
	administratorService: AdministratorService;
    dvoranaService: DvoranaService;
    glumacService: GlumacService;
    predstavaService: PredstavaService;
    ulogaService: UlogaService;
}