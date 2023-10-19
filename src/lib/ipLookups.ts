import { PangeaConfig, UserIntelService, IPIntelService, AuditService, PangeaErrors } from "pangea-node-sdk";

const initializePangea = () => {
    const domain = process.env.PANGEA_DOMAIN;
    const token = process.env.PANGEA_TOKEN;
    const config = new PangeaConfig({ domain: domain });
    const ipIntel = new IPIntelService(String(token), config);

    return ipIntel;
}

const PangeaIPGeolocate = async (ip_address: string) => {
    console.log("Geolocate IP...");
 
    const ipIntel = initializePangea();
    const options = { provider: "digitalelement", verbose: true, raw: true };
    try {
      const response = await ipIntel.geolocate(ip_address, options);
      console.log("Result: ", response.result.data);
  
      return response.result.data
    } catch (e) {
      if (e instanceof PangeaErrors.APIError) {
        console.log("Error", e.summary, e.errors);
      } else {
        console.log("Error: ", e);
      }
    }
  
  }
  

export { PangeaIPGeolocate }